import datetime
from typing import List, Dict
from datetime import datetime, timedelta, timezone
import json
from googleapiclient.discovery import build
from service.user_service import UserService
from service.auth_service import AuthService
from google.oauth2.credentials import Credentials


class CalendarService:
    WORKING_HOURS = (9, 17)  # 9 AM to 5 PM

    @staticmethod
    async def build_calendar_service(user_id: str):
        """Build calendar service with refreshed credentials"""
        try:
            credentials_json = await AuthService.handle_credentials_refresh(user_id)
            credentials_dict = json.loads(credentials_json)
            credentials = Credentials.from_authorized_user_info(
                credentials_dict, scopes=AuthService.SCOPES
            )
            return build("calendar", "v3", credentials=credentials)
        except Exception as e:
            raise ValueError(f"Failed to build calendar service: {str(e)}")

    @staticmethod
    async def get_busy_periods(
        service, user_email: str, start_time: datetime, end_time: datetime
    ) -> List[Dict]:
        """Get busy periods for a user in specified time range"""
        query = {
            "timeMin": start_time.isoformat(),
            "timeMax": end_time.isoformat(),
            "items": [{"id": user_email}],
            "timeZone": "UTC",
        }

        events_result = service.freebusy().query(body=query).execute()
        busy_periods = []

        for calendar in events_result["calendars"].values():
            for period in calendar["busy"]:
                busy_periods.append(
                    {
                        "start": datetime.fromisoformat(period["start"]),
                        "end": datetime.fromisoformat(period["end"]),
                    }
                )

        return sorted(busy_periods, key=lambda x: x["start"])

    @staticmethod
    async def find_common_timings(
        user_ids: List[str], duration_hours: int, day: datetime
    ) -> List[Dict]:
        """Find common free time slots for multiple users"""
        day_start = day.replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        day_end = day_start + timedelta(days=1)

        # Collect all busy periods
        all_busy_periods = []
        for user_id in user_ids:
            user = await UserService.get_user_by_id(user_id)
            if not user or not user.credentials:
                raise ValueError(f"No credentials found for user {user_id}")

            try:
                service = await CalendarService.build_calendar_service(user_id)
                busy_periods = await CalendarService.get_busy_periods(
                    service, user.email, day_start, day_end
                )
                all_busy_periods.extend(busy_periods)
            except ValueError as e:
                print(f"Failed to access calendar for user {user_id}: {str(e)}")
                continue

        # Find available slots
        available_slots = []
        current_time = day_start
        duration = timedelta(hours=duration_hours)

        while current_time + duration <= day_end:
            # Check working hours (9 AM to 5 PM)
            if not (
                CalendarService.WORKING_HOURS[0]
                <= current_time.hour
                < CalendarService.WORKING_HOURS[1]
            ):
                current_time = current_time + timedelta(hours=1)
                current_time = current_time.replace(minute=0, second=0, microsecond=0)
                continue

            # Check for conflicts with busy periods
            slot_end = current_time + duration
            is_available = True

            for busy in all_busy_periods:
                if current_time < busy["end"] and slot_end > busy["start"]:
                    is_available = False
                    current_time = busy["end"]
                    break

            if is_available:
                available_slots.append(
                    {"start": current_time.isoformat(), "end": slot_end.isoformat()}
                )
                current_time += duration
            else:
                current_time = current_time.replace(minute=0, second=0, microsecond=0)
                current_time += timedelta(hours=1)

        return available_slots

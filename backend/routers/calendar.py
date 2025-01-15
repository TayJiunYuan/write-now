from fastapi import APIRouter
from service.calendar_service import CalendarService
from typing import List
from datetime import datetime

router = APIRouter(prefix="/calendar", tags=["calendar"])


@router.post("/find_common_timings")
async def find_common_timings(user_ids: List[str], duration_hours: int, day: datetime):
    """Find common free time slots for user_ids for duration_hours on a certain day. The day is in local timezone eg. If you want to check for 2025-1-15, please input anywhere between 2025-01-14T16:00:00.000Z and 2025-01-15T16:00:00.000Z"""
    return await CalendarService.find_common_timings(user_ids, duration_hours, day)

from fastapi import APIRouter, HTTPException
from service.calendar_service import CalendarService
from typing import List
from datetime import datetime

router = APIRouter(prefix="/calendar", tags=["calendar"])


@router.post("/find_common_timings")
async def find_common_timings(user_ids: List[str], duration_hours: int, day: datetime):
    """If you want to check for 2025-01-15, just use 2025-01-15T00:00:00.000Z"""
    try:
        return await CalendarService.find_common_timings(user_ids, duration_hours, day)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/get_calendar_events")
async def get_calendar_events(user_id: str, start_time: datetime, end_time: datetime):
    try:
        return await CalendarService.get_calendar_events(user_id, start_time, end_time)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

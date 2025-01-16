from fastapi import APIRouter
from service.calendar_service import CalendarService
from typing import List
from datetime import datetime

router = APIRouter(prefix="/calendar", tags=["calendar"])


@router.post("/find_common_timings")
async def find_common_timings(user_ids: List[str], duration_hours: int, day: datetime):
    """If you want to check for 2025-01-15, just use 2025-01-15T00:00:00.000Z"""
    return await CalendarService.find_common_timings(user_ids, duration_hours, day)

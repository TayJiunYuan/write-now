from fastapi import APIRouter, HTTPException
from service.meeting_service import MeetingService
from typing import List, Optional
from models.meeting import MeetingResponse, MeetingRequest
from fastapi import Query

router = APIRouter(prefix="/meetings", tags=["meetings"])


@router.post("/create")
async def create_meeting(request: MeetingRequest):
    """Create a Google Meet meeting and calendar event"""
    try:
        return await MeetingService.create_meeting(request)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{meeting_id}")
async def get_meeting(meeting_id: str) -> MeetingResponse:
    meeting = await MeetingService.get_meeting_by_id(meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting


@router.get("/", response_model=List[MeetingResponse])
async def get_meetings(organizer_id: Optional[str] = Query(None), programme_id: Optional[str] = Query(None)):
    return await MeetingService.get_meetings(programme_id, organizer_id)

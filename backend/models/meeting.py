from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class MeetingResponse(BaseModel):
    id: str
    programme_id: str
    organizer_id: str
    start_time: datetime
    duration_hours: int
    summary: str
    description: Optional[str] = ""
    meet_link: str
    start: datetime
    end: datetime
    organizer: str
    attendees: list[str]
    transcript: Optional[str] = ""
    action_items: Optional[list[str]] = []

class MeetingRequest(BaseModel):
    programme_id: str
    organizer_id: str
    attendee_ids: list[str]
    start_time: datetime
    duration_hours: int
    summary: str
    description: Optional[str] = ""


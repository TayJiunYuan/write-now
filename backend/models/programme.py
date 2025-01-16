from pydantic import BaseModel, Field
from typing import Dict, List, Optional
import bson
from datetime import datetime


class ProgrammeRequest(BaseModel):
    name: str
    description: str
    type: str
    groups: Dict[str, List[str]]  # {group_name: [user_ids]}
    datetime: datetime
    location: str

class Programme(BaseModel):
    _id: Optional[bson.ObjectId]
    name: str
    description: str
    type: str
    groups: Dict[str, List[str]]
    datetime: datetime
    location: str


class ProgrammeResponse(BaseModel):
    id: str
    name: str
    description: str
    type: str
    groups: Dict[str, List[str]]
    datetime: datetime
    location: str
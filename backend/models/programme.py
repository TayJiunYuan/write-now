from pydantic import BaseModel, Field
from typing import Dict, List, Optional
import bson


class ProgrammeRequest(BaseModel):
    name: str
    description: str
    type: str
    groups: Dict[str, List[str]]  # {group_name: [user_ids]}


class Programme(BaseModel):
    _id: Optional[bson.ObjectId]
    name: str
    description: str
    type: str
    groups: Dict[str, List[str]]


class ProgrammeResponse(BaseModel):
    id: str
    name: str
    description: str
    type: str
    groups: Dict[str, List[str]]

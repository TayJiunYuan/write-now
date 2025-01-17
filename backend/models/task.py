from pydantic import BaseModel
from typing import Optional
from enum import Enum
from datetime import datetime
import bson


class TaskStatus(str, Enum):
    NOT_STARTED = "NOT_STARTED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"


class TaskType(str, Enum):
    BASIC = "BASIC"
    BUDGET = "BUDGET"
    REPORT = "REPORT"
    FORM = "FORM"


class TaskRequest(BaseModel):
    assignee_id: str
    assigner_id: str
    name: str
    description: str
    deadline: str
    status: TaskStatus = TaskStatus.NOT_STARTED
    programme_id: str
    task_type: Optional[TaskType] = TaskType.BASIC


class Task(BaseModel):
    _id: Optional[bson.ObjectId]
    assignee_id: str
    assigner_id: str
    name: str
    description: str
    created_at: str
    deadline: str
    status: TaskStatus
    programme_id: str
    assigned_to_self: bool
    task_type: Optional[TaskType] = TaskType.BASIC
    task_link: Optional[str] = ""


class TaskResponse(BaseModel):
    id: str
    assignee_id: str
    assigner_id: str
    name: str
    description: str
    created_at: str
    deadline: str
    status: TaskStatus
    programme_id: str
    assigned_to_self: bool
    task_type: Optional[TaskType] = TaskType.BASIC
    task_link: Optional[str] = ""


class TaskDetailsResponse(BaseModel):
    name: Optional[str]
    description: Optional[str]

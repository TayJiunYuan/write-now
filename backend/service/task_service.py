from models.task import TaskRequest, TaskResponse
from db.db import db
from bson import ObjectId
from typing import Optional, List
from datetime import datetime


class TaskService:
    collection_name = "tasks"

    @staticmethod
    async def create_task(task: TaskRequest) -> TaskResponse:
        """Create a new task."""
        task_dict = task.dict()
        task_dict["created_at"] = datetime.now().isoformat()
        task_dict["assigned_to_self"] = (
            task_dict["assignee_id"] == task_dict["assigner_id"]
        )
        result = await db.get_collection(TaskService.collection_name).insert_one(
            task_dict
        )
        return TaskResponse(id=str(result.inserted_id), **task_dict)

    @staticmethod
    async def get_tasks(
        assigner_id: Optional[str] = None,
        assignee_id: Optional[str] = None,
        programme_id: Optional[str] = None,
    ) -> List[TaskResponse]:
        """Retrieve tasks based on optional filters."""
        filter_query = {}
        if assigner_id:
            filter_query["assigner_id"] = assigner_id
        if assignee_id:
            filter_query["assignee_id"] = assignee_id
            filter_query["assigned_to_self"] = False
        if programme_id:
            filter_query["programme_id"] = programme_id

        tasks = []
        cursor = db.get_collection(TaskService.collection_name).find(filter_query)
        async for document in cursor:
            document["id"] = str(document.pop("_id"))
            tasks.append(TaskResponse(**document))
        return tasks

    @staticmethod
    async def get_task_by_id(task_id: str) -> Optional[TaskResponse]:
        """Retrieve a task by its ID."""
        try:
            document = await db.get_collection(TaskService.collection_name).find_one(
                {"_id": ObjectId(task_id)}
            )
            if document:
                document["id"] = str(document.pop("_id"))
                return TaskResponse(**document)
            return None
        except Exception:
            return None

    @staticmethod
    async def update_task(task_id: str, task: TaskRequest) -> Optional[TaskResponse]:
        """Update all fields of a task except ID."""
        try:
            task_dict = task.dict()
            task_dict["assigned_to_self"] = (
                task_dict["assignee_id"] == task_dict["assigner_id"]
            )
            document = await db.get_collection(
                TaskService.collection_name
            ).find_one_and_update(
                {"_id": ObjectId(task_id)},
                {"$set": task_dict},
                return_document=True,
            )
            if document:
                document["id"] = str(document.pop("_id"))
                return TaskResponse(**document)
            return None
        except Exception:
            return None

    @staticmethod
    async def delete_task(task_id: str) -> bool:
        """Delete a task by its ID."""
        try:
            result = await db.get_collection(TaskService.collection_name).delete_one(
                {"_id": ObjectId(task_id)}
            )
            return result.deleted_count > 0
        except Exception:
            return False

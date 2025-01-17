from models.task import TaskRequest, TaskResponse, TaskDetailsResponse
from db.db import db
from bson import ObjectId
from typing import Optional, List
from datetime import datetime
from service.openapi_service import TaskCreationAIService, TaskWorkflowAIService
from service.drive_service import DriveService
import os
from models.task import TaskType
import json


class TaskService:
    collection_name = "tasks"

    @staticmethod
    async def create_task(task: TaskRequest) -> TaskResponse:
        """Create a new task."""
        try:
            task_dict = task.dict()
            task_dict["created_at"] = datetime.now().isoformat()
            task_dict["assigned_to_self"] = (
                task_dict["assignee_id"] == task_dict["assigner_id"]
            )
            if (
                task_dict["task_type"] != TaskType.BASIC
                and task_dict["task_type"] != None
            ):
                task_dict["task_link"] = await DriveService.copy_template_file(
                    task_dict["assignee_id"], task_dict["task_type"]
                )
            result = await db.get_collection(TaskService.collection_name).insert_one(
                task_dict
            )
            return TaskResponse(id=str(result.inserted_id), **task_dict)
        except Exception as e:
            raise e

    @staticmethod
    async def get_tasks(
        assigner_id: Optional[str] = None,
        assignee_id: Optional[str] = None,
        programme_id: Optional[str] = None,
    ) -> List[TaskResponse]:
        """Retrieve tasks based on optional filters."""
        try:
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
        except Exception:
            raise ValueError("Get tasks failed")

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

    @staticmethod
    async def task_details_with_ai(action_item: str) -> TaskDetailsResponse:
        try:
            task_creation_ai_service = TaskCreationAIService(os.getenv("OPEN_API_KEY"))
            response = task_creation_ai_service.get_response(action_item)
            return TaskDetailsResponse(**response)
        except Exception as e:
            raise ValueError(f"Task details with AI failed: {str(e)}")

    @staticmethod
    async def get_task_file_name(task_id: str) -> str:
        try:
            task = await TaskService.get_task_by_id(task_id)
            if task.task_type == TaskType.BASIC:
                return None
            file_name = await DriveService.get_file_name_from_link(
                task.assignee_id, task.task_link
            )
            return file_name
        except Exception as e:
            raise ValueError(f"Failed to get file name from link: {str(e)}")

    @staticmethod
    async def get_task_workflow_ai(task_id: str) -> str:
        try:
            task = await TaskService.get_task_by_id(task_id)
            task_workflow_ai_service = TaskWorkflowAIService(os.getenv("OPEN_API_KEY"))
            response = task_workflow_ai_service.get_response(
                json.dumps(
                    {
                        "name": task.name,
                        "description": task.description,
                        "deadline": task.deadline,
                    }
                )
            )
            return response
        except Exception as e:
            raise ValueError(f"Failed to get task workflow from AI: {str(e)}")

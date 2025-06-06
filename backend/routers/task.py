from fastapi import APIRouter, HTTPException, Query, Body
from models.task import TaskRequest, TaskResponse, TaskDetailsResponse
from service.task_service import TaskService
from typing import Optional, List

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.post("/task_details_with_ai", response_model=TaskDetailsResponse)
async def task_details_with_ai(action_item: str = Body(..., embed=True)):
    """Get AI-generated task details from an action item

    Args:
        action_item: The action item text from which to generate task details
    """
    try:
        return await TaskService.task_details_with_ai(action_item)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Task details with AI failed: {str(e)}"
        )


@router.post("/", response_model=TaskResponse)
async def create_task(task: TaskRequest):
    """Create a new task. Returns the created task."""
    try:
        return await TaskService.create_task(task)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{task_id}/get_ai_workflow")
async def get_ai_workflow(task_id: str):
    """Get the AI-generated workflow for a task"""
    try:
        return await TaskService.get_task_workflow_ai(task_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{task_id}/file_name", response_model=str | None)
async def get_task_file_name(task_id: str):
    """Get the file name of a task"""
    try:
        file_name = await TaskService.get_task_file_name(task_id)
        if file_name is None:
            return None
        return file_name
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(task_id: str):
    """Retrieve a specific task by ID."""
    task = await TaskService.get_task_by_id(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.get("/", response_model=List[TaskResponse])
async def get_tasks(
    assigner_id: Optional[str] = Query(None),
    assignee_id: Optional[str] = Query(None),
    programme_id: Optional[str] = Query(None),
):
    """
    Retrieve tasks with optional filters.
    - Filter by assigner ID
    - Filter by assignee ID (excludes self-assigned tasks)
    - Filter by event ID
    - No filters returns all tasks
    """
    try:
        return await TaskService.get_tasks(assigner_id, assignee_id, programme_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Get tasks failed: {str(e)}")


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(task_id: str, task: TaskRequest):
    """Update all fields of a task except ID. Returns the updated task."""
    updated_task = await TaskService.update_task(task_id, task)
    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated_task


@router.delete("/{task_id}", response_model=bool)
async def delete_task(task_id: str):
    """Delete a task by ID. Returns True if successful"""
    success = await TaskService.delete_task(task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return success

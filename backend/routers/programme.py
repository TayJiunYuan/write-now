from fastapi import APIRouter, HTTPException
from models.programme import ProgrammeRequest, ProgrammeResponse
from service.programme_service import ProgrammeService
from typing import List

router = APIRouter(prefix="/programmes", tags=["programmes"])


@router.post("/", response_model=ProgrammeResponse)
async def create_programme(programme: ProgrammeRequest):
    """Create a new programme. Returns the created programme."""
    return await ProgrammeService.create_programme(programme)


@router.get("/{programme_id}", response_model=ProgrammeResponse)
async def get_programme(programme_id: str):
    """Get a programme by ID."""
    programme = await ProgrammeService.get_programme_by_id(programme_id)
    if not programme:
        raise HTTPException(status_code=404, detail="Programme not found")
    return programme


@router.get("/", response_model=List[ProgrammeResponse])
async def get_all_programmes():
    """Get all programmes."""
    return await ProgrammeService.get_all_programmes()


@router.put("/{programme_id}", response_model=ProgrammeResponse)
async def update_programme(programme_id: str, programme: ProgrammeRequest):
    """Update a programme. Returns the updated programme."""
    updated = await ProgrammeService.update_programme(programme_id, programme)
    if not updated:
        raise HTTPException(status_code=404, detail="Programme not found")
    return updated


@router.delete("/{programme_id}", response_model=bool)
async def delete_programme(programme_id: str):
    """Delete a programme. Returns True if successful"""
    success = await ProgrammeService.delete_programme(programme_id)
    if not success:
        raise HTTPException(status_code=404, detail="Programme not found")
    return success

from fastapi import APIRouter, HTTPException
from service.email_service import EmailService
from typing import List
from models.email import EmailWithLongSummary, EmailWithShortSummary

router = APIRouter(prefix="/emails", tags=["emails"])


@router.get("/{user_id}/{email_id}/long_summary", response_model=EmailWithLongSummary)
async def get_email_long_summary(user_id: str, email_id: str):
    """Get a specific email by ID with long summary"""
    try:
        return await EmailService.get_email_by_id_with_long_summary(user_id, email_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/with_short_summary/{user_id}", response_model=List[EmailWithShortSummary])
async def get_emails_with_short_summary(user_id: str, max_results: int = 4):
    try:
        return await EmailService.get_emails_with_short_summary(user_id, max_results)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

from fastapi import APIRouter, HTTPException
from models.user import User
from service.user_service import UserService

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/", response_model=list[User])
async def get_all_users():
    return await UserService.get_all_users()


@router.get("/{user_id}", response_model=User)
async def get_user_by_id(user_id: str):
    user = await UserService.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user



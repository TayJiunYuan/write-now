from fastapi import APIRouter, HTTPException
from models.user import User, User_without_credentials
from service.user_service import UserService

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/without-credentials", response_model=list[User_without_credentials])
async def get_all_users_without_credentials():
    return await UserService.get_all_users_without_credentials()


@router.get("/{user_id}/without-credentials", response_model=User_without_credentials)
async def get_user_without_credentials_by_id(user_id: str):
    user = await UserService.get_user_without_credentials_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/{user_id}", response_model=User)
async def get_user_by_id(user_id: str):
    user = await UserService.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/", response_model=list[User])
async def get_all_users():
    return await UserService.get_all_users()

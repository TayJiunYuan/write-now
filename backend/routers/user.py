from fastapi import APIRouter, HTTPException
from models.user import User, UserWithoutCredentials
from service.user_service import UserService

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/{user_id}/without-credentials", response_model=UserWithoutCredentials)
async def get_UserWithoutCredentials_by_id(user_id: str):
    user = await UserService.get_UserWithoutCredentials_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/without-credentials", response_model=list[UserWithoutCredentials])
async def get_all_users_without_credentials():
    try:
        return await UserService.get_all_users_without_credentials()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Get all users without credentials failed: {str(e)}",
        )


@router.get("/{user_id}", response_model=User)
async def get_user_by_id(user_id: str):
    user = await UserService.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/", response_model=list[User])
async def get_all_users():
    try:
        return await UserService.get_all_users()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Get all users failed: {str(e)}")

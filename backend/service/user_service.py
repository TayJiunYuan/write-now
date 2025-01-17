from db.db import db
from models.user import User, UserWithoutCredentials


class UserService:
    collection_name = "users"

    @staticmethod
    async def get_UserWithoutCredentials_by_id(
        google_id: str,
    ) -> UserWithoutCredentials | None:
        try:
            document = await db.get_collection(UserService.collection_name).find_one(
                {"id": google_id}, {"credentials": 0}
            )
            if document:
                return UserWithoutCredentials(**document)
        except Exception:
            return None

    @staticmethod
    async def get_all_users_without_credentials() -> list[UserWithoutCredentials]:
        users = []
        print("Getting all users without credentials")
        cursor = db.get_collection(UserService.collection_name).find(
            {}, {"credentials": 0}
        )
        async for document in cursor:
            users.append(UserWithoutCredentials(**document))
        return users

    @staticmethod
    async def get_user_by_id(google_id: str) -> User | None:
        try:
            document = await db.get_collection(UserService.collection_name).find_one(
                {"id": google_id}
            )
            if document:
                return User(**document)
        except Exception:
            return None

    @staticmethod
    async def get_all_users() -> list[User]:
        users = []
        cursor = db.get_collection(UserService.collection_name).find({})
        async for document in cursor:
            users.append(User(**document))
        return users

    @staticmethod
    async def create_user(user: User) -> User:
        try:
            document = user.dict()
            await db.get_collection(UserService.collection_name).insert_one(document)
            return user
        except Exception as e:
            raise ValueError(f"Create user failed: {str(e)}")

    @staticmethod
    async def update_user_credentials(user_id: str, credentials: str):
        try:
            await db.get_collection(UserService.collection_name).update_one(
                {"id": user_id}, {"$set": {"credentials": credentials}}
            )
        except Exception as e:
            raise ValueError(f"Update user credentials failed: {str(e)}")


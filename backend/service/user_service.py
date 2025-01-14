from db.db import db
from models.user import User


class UserService:
    collection_name = "users"

    @staticmethod
    async def get_all_users() -> list[User]:
        users = []
        cursor = db.get_collection(UserService.collection_name).find({})
        async for document in cursor:
            users.append(User(**document))
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
    async def create_user(user: User) -> User:
        document = user.dict()
        await db.get_collection(UserService.collection_name).insert_one(document)
        return user

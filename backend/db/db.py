from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional


class Database:
    client: Optional[AsyncIOMotorClient] = None

    # You can change these constants according to your MongoDB configuration
    MONGODB_URL = "mongodb://localhost:27017"
    DATABASE_NAME = "writenow"

    @classmethod
    async def connect_db(cls):
        """Create database connection."""
        try:
            cls.client = AsyncIOMotorClient(cls.MONGODB_URL)
            print("Connected to MongoDB successfully!")
        except Exception as e:
            print(f"Could not connect to MongoDB: {e}")
            raise

    @classmethod
    async def close_db(cls):
        """Close database connection."""
        if cls.client is not None:
            cls.client.close()
            print("MongoDB connection closed.")

    @classmethod
    def get_db(cls):
        """Get database instance."""
        if cls.client is None:
            raise Exception("Database not initialized. Call connect_db first.")
        return cls.client[cls.DATABASE_NAME]

    @classmethod
    def get_collection(cls, collection_name: str):
        """Get a specific collection from the database."""
        return cls.get_db()[collection_name]


# Create a database instance
db = Database()

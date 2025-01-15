from models.programme import ProgrammeRequest, ProgrammeResponse
from db.db import db
from bson import ObjectId
from typing import Optional, List


class ProgrammeService:
    collection_name = "programmes"

    @staticmethod
    async def create_programme(programme: ProgrammeRequest) -> ProgrammeResponse:
        """Create a new programme."""
        programme_dict = programme.dict()
        result = await db.get_collection(ProgrammeService.collection_name).insert_one(
            programme_dict
        )
        return ProgrammeResponse(id=str(result.inserted_id), **programme_dict)

    @staticmethod
    async def get_all_programmes() -> List[ProgrammeResponse]:
        """Get all programmes."""
        programmes = []
        cursor = db.get_collection(ProgrammeService.collection_name).find({})
        async for document in cursor:
            document["id"] = str(document.pop("_id"))
            programmes.append(ProgrammeResponse(**document))
        return programmes

    @staticmethod
    async def get_programme_by_id(programme_id: str) -> Optional[ProgrammeResponse]:
        """Get a programme by ID."""
        try:
            document = await db.get_collection(
                ProgrammeService.collection_name
            ).find_one({"_id": ObjectId(programme_id)})
            if document:
                document["id"] = str(document.pop("_id"))
                return ProgrammeResponse(**document)
            return None
        except Exception:
            return None

    @staticmethod
    async def update_programme(
        programme_id: str, programme: ProgrammeRequest
    ) -> Optional[ProgrammeResponse]:
        """Update a programme."""
        try:
            programme_dict = programme.dict()
            document = await db.get_collection(
                ProgrammeService.collection_name
            ).find_one_and_update(
                {"_id": ObjectId(programme_id)},
                {"$set": programme_dict},
                return_document=True,
            )
            if document:
                document["id"] = str(document.pop("_id"))
                return ProgrammeResponse(**document)
            return None
        except Exception:
            return None

    @staticmethod
    async def delete_programme(programme_id: str) -> bool:
        """Delete a programme."""
        try:
            result = await db.get_collection(
                ProgrammeService.collection_name
            ).delete_one({"_id": ObjectId(programme_id)})
            return result.deleted_count > 0
        except Exception:
            return False

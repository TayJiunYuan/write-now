from service.auth_service import AuthService
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
import json
from models.task import TaskType
import os


class DriveService:
    @staticmethod
    async def build_drive_service(user_id: str):
        """Build drive service with refreshed credentials"""
        credentials_json = await AuthService.handle_credentials_refresh(user_id)
        credentials_dict = json.loads(credentials_json)
        credentials = Credentials.from_authorized_user_info(
            credentials_dict, scopes=AuthService.SCOPES
        )
        return build("drive", "v3", credentials=credentials)

    @staticmethod
    async def copy_template_file(user_id: str, task_type: TaskType):
        """Copy template file to user's drive"""
        try:
            if task_type == TaskType.BUDGET:
                template_file_id = os.getenv("BUDGET_TEMPLATE_ID")
            elif task_type == TaskType.REPORT:
                template_file_id = os.getenv("REPORT_TEMPLATE_ID")
            elif task_type == TaskType.FORM:
                template_file_id = os.getenv("FORM_TEMPLATE_ID")
            drive_service = await DriveService.build_drive_service(user_id)
            copied_file = (
                drive_service.files().copy(fileId=template_file_id, body={}).execute()
            )
            id = copied_file["id"]
            if task_type == TaskType.BUDGET:
                new_copied_link = f"https://docs.google.com/spreadsheets/d/{id}"
            elif task_type == TaskType.REPORT:
                new_copied_link = f"https://docs.google.com/document/d/{id}"
            elif task_type == TaskType.FORM:
                new_copied_link = f"https://docs.google.com/forms/d/{id}"
            return new_copied_link
        except Exception as e:
            raise ValueError(f"Failed to copy template file: {str(e)}")

    @staticmethod
    async def get_file_name_from_link(user_id: str, link: str) -> str:
        """Get the file name from the link"""
        try:
            drive_service = await DriveService.build_drive_service(user_id)
            file_id = link.split("/")[-1]
            file_metadata = (
                drive_service.files().get(fileId=file_id, fields="name").execute()
            )
            return file_metadata["name"]
        except Exception as e:
            raise ValueError(f"Failed to get file name from link: {str(e)}")

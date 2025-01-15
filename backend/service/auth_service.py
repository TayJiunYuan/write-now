import httpx
from models.user import User
from service.user_service import UserService
from google_auth_oauthlib.flow import Flow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
import os
from dotenv import load_dotenv
import json

load_dotenv()


class AuthService:
    SCOPES = [
        "openid",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/meetings.space.created",
    ]

    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
    REDIRECT_URI = os.getenv("REDIRECT_URI")

    @staticmethod
    def create_auth_flow() -> Flow:
        """Create Google OAuth2 flow"""
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": AuthService.GOOGLE_CLIENT_ID,
                    "client_secret": AuthService.GOOGLE_CLIENT_SECRET,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [AuthService.REDIRECT_URI],
                }
            },
            scopes=AuthService.SCOPES,
        )
        flow.redirect_uri = AuthService.REDIRECT_URI
        return flow

    @staticmethod
    async def get_user_info(credentials) -> dict:
        """Get user info from Google"""
        try:
            userinfo_endpoint = "https://www.googleapis.com/oauth2/v3/userinfo"
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    userinfo_endpoint,
                    headers={"Authorization": f"Bearer {credentials.token}"},
                )
                return response.json()
        except Exception as e:
            raise ValueError(f"Failed to get user info: {str(e)}")

    @staticmethod
    async def get_or_create_user(user_info: dict, credentials_json: str) -> User:
        """Get existing user or create new one"""
        user = await UserService.get_user_by_id(user_info["sub"])
        if not user:
            user = await UserService.create_user(
                User(
                    id=user_info["sub"],
                    email=user_info["email"],
                    name=user_info["name"],
                    credentials=credentials_json,  # Store encrypted credentials
                )
            )
        return user

    @staticmethod
    async def handle_credentials_refresh(user_id: str):
        try:
            user = await UserService.get_user_by_id(user_id)
            if not user or not user.credentials:
                raise ValueError(f"No credentials found for user {user_id}")
            credentials_dict = json.loads(user.credentials)
            credentials = Credentials.from_authorized_user_info(
                credentials_dict, scopes=AuthService.SCOPES
            )
            # Check if credentials need refresh
            if credentials.expired and credentials.refresh_token:
                request = Request()
                credentials.refresh(request)
                await UserService.update_user_credentials(
                    user_id, credentials.to_json()
                )
            return credentials.to_json()
        except Exception as e:
            raise ValueError(f"Failed to handle credentials refresh: {str(e)}")

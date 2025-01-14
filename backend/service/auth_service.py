from google.oauth2 import id_token
from google.auth.transport import requests
import httpx
from models.user import User
from service.user_service import UserService
from dotenv import load_dotenv
import os
load_dotenv()

class AuthService:
    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
    GOOGLE_TOKEN_ENDPOINT = os.getenv("GOOGLE_TOKEN_ENDPOINT")
    REDIRECT_URI = os.getenv("REDIRECT_URI")

    @staticmethod
    async def exchange_code_for_token(auth_code: str, redirect_uri: str) -> dict:
        """Exchange authorization code for tokens"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                AuthService.GOOGLE_TOKEN_ENDPOINT,
                data={
                    "client_id": AuthService.GOOGLE_CLIENT_ID,
                    "client_secret": AuthService.GOOGLE_CLIENT_SECRET,
                    "code": auth_code,
                    "grant_type": "authorization_code",
                    "redirect_uri": redirect_uri,
                },
            )
            return response.json()

    @staticmethod
    async def verify_and_get_user(id_token_str: str) -> dict:
        """Verify ID token and get user info"""
        try:
            idinfo = id_token.verify_oauth2_token(
                id_token_str, requests.Request(), AuthService.GOOGLE_CLIENT_ID
            )
            return idinfo
        except ValueError:
            raise ValueError("Invalid ID token")

    @staticmethod
    async def get_or_create_user(user_info: dict) -> User:
        """Get existing user or create new one"""
        user = await UserService.get_user_by_id(user_info["sub"])
        if not user:
            user = await UserService.create_user(
                User(
                    id=user_info["sub"],
                    email=user_info["email"],
                    name=user_info["name"],
                )
            )
        return user

from fastapi import APIRouter, HTTPException
from models.user import User
from service.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/login")
async def login():
    return {
        "url": f"https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={AuthService.GOOGLE_CLIENT_ID}&"
        f"response_type=code&"
        f"scope=openid%20email%20profile&"
        f"redirect_uri={AuthService.REDIRECT_URI}"
    }


@router.get("/callback")
async def auth_callback(code: str):
    try:
        # Exchange auth code for tokens
        tokens = await AuthService.exchange_code_for_token(
            code,
            AuthService.REDIRECT_URI,
        )

        # Verify ID token and get user info
        user_info = await AuthService.verify_and_get_user(tokens["id_token"])

        # Get or create user in database
        user = await AuthService.get_or_create_user(user_info)

        return user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse
from models.user import User
from service.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/login")
async def login():
    """Start OAuth flow"""
    flow = AuthService.create_auth_flow()
    authorization_url, state = flow.authorization_url(
        access_type="offline", include_granted_scopes="true", prompt="consent"
    )
    return {"url": authorization_url}


@router.get("/callback")
async def auth_callback(code: str, state: str):
    """Handle OAuth callback"""
    try:
        # Exchange code for credentials
        flow = AuthService.create_auth_flow()
        flow.fetch_token(code=code)
        credentials = flow.credentials

        # Get user info
        user_info = await AuthService.get_user_info(credentials)

        # Store credentials as JSON
        credentials_json = credentials.to_json()

        # Get or create user
        user = await AuthService.get_or_create_user(user_info, credentials_json)

        redirect_url = f"http://localhost:3000?user_id={user.id}"
        
        return RedirectResponse(url=redirect_url)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

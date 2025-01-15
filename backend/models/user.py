from pydantic import BaseModel, EmailStr
from typing import Optional


class User(BaseModel):
    id: str  # Google ID
    email: EmailStr
    name: str
    credentials: Optional[str] = None  # Store encrypted credentials

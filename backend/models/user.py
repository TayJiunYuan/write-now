from pydantic import BaseModel, EmailStr


class User(BaseModel):
    id: str  # Google ID
    email: EmailStr
    name: str

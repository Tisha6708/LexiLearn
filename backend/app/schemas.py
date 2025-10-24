from pydantic import BaseModel, EmailStr
from typing import Optional

# ---------- USERS ----------
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    role: Optional[str] = "student"

class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: Optional[str]
    role: str

    class Config:
        orm_mode = True


# ---------- AUTH ----------
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: Optional[str] = None

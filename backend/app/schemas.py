from typing import Optional, Dict, Any
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    role: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None

class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: Optional[str] = None
    role: str
    progress: Optional[Dict[str, Any]] = {}

class ProgressUpdate(BaseModel):
    progress: Dict[str, Any]

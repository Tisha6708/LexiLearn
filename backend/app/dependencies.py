# backend/app/dependencies.py
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status
from sqlmodel import select
from jose import JWTError, jwt

from .config import settings
from .db import get_session
from .models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), session=Depends(get_session)) -> User:
    from .auth import decode_token
    token_data = decode_token(token)
    if not token_data.sub:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")
    statement = select(User).where(User.id == int(token_data.sub))
    user = session.exec(statement).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

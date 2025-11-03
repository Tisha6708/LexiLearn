from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from datetime import timedelta
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.exc import IntegrityError

from ..schemas import UserCreate, Token, UserOut
from ..models import User
from ..db import get_session
from ..auth import get_password_hash, verify_password, create_access_token, decode_token
from ..config import settings
from ..dependencies import get_current_user

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup", response_model=UserOut)
def signup(user_in: UserCreate, session=Depends(get_session)):
    user = User(email=user_in.email, hashed_password=get_password_hash(user_in.password),
                full_name=user_in.full_name, role=user_in.role, progress={})
    session.add(user)
    try:
        session.commit()
        session.refresh(user)
    except IntegrityError:
        session.rollback()
        raise HTTPException(status_code=400, detail="Email already registered")
    return user

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), session=Depends(get_session)):
    # OAuth2PasswordRequestForm uses fields: username, password
    statement = select(User).where(User.email == form_data.username)
    user = session.exec(statement).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    access_token = create_access_token(subject=str(user.id), role=user.role,
                                       expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserOut)
async def get_me(token: str = Depends(oauth2_scheme), session=Depends(get_session)):
    payload = decode_token(token)
    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = session.get(User, int(user_id))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user
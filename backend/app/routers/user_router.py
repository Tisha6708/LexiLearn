from fastapi import APIRouter, Depends, HTTPException
from ..schemas import UserOut, ProgressUpdate
from ..dependencies import get_current_user
from ..db import get_session

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserOut)
def read_me(current_user=Depends(get_current_user)):
    return current_user

@router.post("/progress", response_model=UserOut)
def update_progress(payload: ProgressUpdate, current_user=Depends(get_current_user), session=Depends(get_session)):
    # Merge progress dictionaries (client sends partial updates)
    user = current_user
    existing = user.progress or {}
    existing.update(payload.progress)
    user.progress = existing
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

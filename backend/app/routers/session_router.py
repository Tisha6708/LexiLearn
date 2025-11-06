# from fastapi import APIRouter, HTTPException
# from app import models
# from app.db import database
# from sqlalchemy import select
# from datetime import datetime
# from app.ai_utils import calculate_accuracy

# router = APIRouter()

# # ---------- START READING SESSION ----------
# @router.post("/", status_code=201)
# async def start_reading_session(data: dict):
#     required_fields = ["user_id", "lesson_id", "spoken_text"]
#     if not all(field in data for field in required_fields):
#         raise HTTPException(status_code=400, detail="Missing required fields")

#     # Fetch expected lesson content
#     lesson_query = select(models.lessons).where(models.lessons.c.id == data["lesson_id"])
#     lesson = await database.fetch_one(lesson_query)
#     if not lesson:
#         raise HTTPException(status_code=404, detail="Lesson not found")

#     # AI similarity scoring
#     analysis = calculate_accuracy(data["spoken_text"], lesson["content"])
#     wpm = len(data["spoken_text"].split()) // 2  # still simple estimate

#     insert_query = models.reading_sessions.insert().values(
#         user_id=data["user_id"],
#         lesson_id=data["lesson_id"],
#         spoken_text=data["spoken_text"],
#         wpm=wpm,
#         accuracy=analysis["accuracy"],
#         errors={"missing_words": analysis["errors"]},
#         recommendations={"tip": analysis["recommendations"]},
#     )
#     session_id = await database.execute(insert_query)

#     return {
#         "id": session_id,
#         "message": "Reading session analyzed successfully",
#         "metrics": {
#             "wpm": wpm,
#             "accuracy": analysis["accuracy"],
#             "errors": analysis["errors"],
#         },
#     }


# # ---------- GET USER SESSIONS ----------
# @router.get("/user/{user_id}")
# async def get_user_sessions(user_id: int):
#     query = select(models.reading_sessions).where(models.reading_sessions.c.user_id == user_id)
#     sessions = await database.fetch_all(query)
#     return {"sessions": sessions}


# # ---------- GET SESSION BY ID ----------
# @router.get("/{session_id}")
# async def get_session(session_id: int):
#     query = select(models.reading_sessions).where(models.reading_sessions.c.id == session_id)
#     session = await database.fetch_one(query)
#     if not session:
#         raise HTTPException(status_code=404, detail="Session not found")
#     return {"session": session}





from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from datetime import datetime
from app.db import get_session
from app.models import ReadingSession, Lesson
from app.ai_utils import calculate_accuracy


router = APIRouter(prefix="/sessions", tags=["Reading Sessions"])

# ---------- START READING SESSION ----------
@router.post("/", status_code=201)
def start_reading_session(data: dict, session: Session = Depends(get_session)):
    required_fields = ["user_id", "lesson_id", "spoken_text"]
    if not all(field in data for field in required_fields):
        raise HTTPException(status_code=400, detail="Missing required fields")

    lesson = session.get(Lesson, data["lesson_id"])
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    # AI similarity scoring
    analysis = calculate_accuracy(data["spoken_text"], lesson.content)
    wpm = len(data["spoken_text"].split()) // 2  # rough estimate

    reading_session = ReadingSession(
        user_id=data["user_id"],
        lesson_id=data["lesson_id"],
        spoken_text=data["spoken_text"],
        wpm=wpm,
        accuracy=analysis["accuracy"],
        errors=analysis["errors"],
        recommendations=analysis["recommendations"],
        created_at=datetime.utcnow(),
    )
    session.add(reading_session)
    session.commit()
    session.refresh(reading_session)

    return {
        "id": reading_session.id,
        "message": "Reading session analyzed successfully",
        "metrics": {
            "wpm": wpm,
            "accuracy": analysis["accuracy"],
            "errors": analysis["errors"],
        },
    }

# ---------- GET USER SESSIONS ----------
@router.get("/user/{user_id}")
def get_user_sessions(user_id: int, session: Session = Depends(get_session)):
    sessions = session.exec(select(ReadingSession).where(ReadingSession.user_id == user_id)).all()
    return {"sessions": sessions}

# ---------- GET SESSION BY ID ----------
@router.get("/{session_id}")
def get_session(session_id: int, session: Session = Depends(get_session)):
    sess = session.get(ReadingSession, session_id)
    if not sess:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"session": sess}

from fastapi import APIRouter, HTTPException
from app.db import database
from sqlalchemy import select
from app import models

router = APIRouter(prefix="/api/parents", tags=["Parents"])

@router.get("/{parent_id}/students")
async def get_linked_students(parent_id: int):
    query = (
        select(models.users.c.id, models.users.c.email, models.users.c.name)
        .select_from(
            models.users.join(models.parent_students, models.users.c.id == models.parent_students.c.student_id)
        )
        .where(models.parent_students.c.parent_id == parent_id)
    )
    students = await database.fetch_all(query)
    return {"students": students}

@router.get("/{student_id}/progress")
async def get_student_progress(student_id: int):
    query = select(models.reading_sessions).where(models.reading_sessions.c.user_id == student_id)
    sessions = await database.fetch_all(query)
    if not sessions:
        raise HTTPException(status_code=404, detail="No progress found")
    avg_accuracy = sum(s["accuracy"] for s in sessions) / len(sessions)
    avg_wpm = sum(s["wpm"] for s in sessions) / len(sessions)
    return {"sessions": sessions, "avg_accuracy": avg_accuracy, "avg_wpm": avg_wpm}

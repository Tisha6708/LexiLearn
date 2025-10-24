from fastapi import APIRouter, HTTPException
from app import models
from app.db import database
from sqlalchemy import select

router = APIRouter()

# ---------- CREATE LESSON ----------
@router.post("/", status_code=201)
async def create_lesson(data: dict):
    query = models.lessons.insert().values(
        title=data.get("title"),
        content=data.get("content"),
        reading_level=data.get("reading_level", "basic"),
    )
    lesson_id = await database.execute(query)
    return {"id": lesson_id, "message": "Lesson created successfully"}

# ---------- GET ALL LESSONS ----------
@router.get("/")
async def get_lessons():
    query = select(models.lessons)
    lessons = await database.fetch_all(query)
    return {"lessons": lessons}

# ---------- GET LESSON BY ID ----------
@router.get("/{lesson_id}")
async def get_lesson(lesson_id: int):
    query = models.lessons.select().where(models.lessons.c.id == lesson_id)
    lesson = await database.fetch_one(query)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return {"lesson": lesson}


# ---------- UPDATE LESSON ----------
@router.put("/{lesson_id}")
async def update_lesson(lesson_id: int, data: dict):
    query = select(models.lessons).where(models.lessons.c.id == lesson_id)
    existing = await database.fetch_one(query)
    if not existing:
        raise HTTPException(status_code=404, detail="Lesson not found")

    update_query = (
        models.lessons.update()
        .where(models.lessons.c.id == lesson_id)
        .values(
            title=data.get("title", existing["title"]),
            content=data.get("content", existing["content"]),
            reading_level=data.get("reading_level", existing["reading_level"]),
        )
    )
    await database.execute(update_query)
    return {"message": "Lesson updated successfully"}

# ---------- DELETE LESSON ----------
@router.delete("/{lesson_id}")
async def delete_lesson(lesson_id: int):
    query = select(models.lessons).where(models.lessons.c.id == lesson_id)
    existing = await database.fetch_one(query)
    if not existing:
        raise HTTPException(status_code=404, detail="Lesson not found")

    delete_query = models.lessons.delete().where(models.lessons.c.id == lesson_id)
    await database.execute(delete_query)
    return {"message": "Lesson deleted successfully"}

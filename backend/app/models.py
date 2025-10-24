from sqlalchemy import Table, Column, Integer, String, Boolean, ForeignKey, DateTime, JSON, MetaData
from sqlalchemy.sql import func
from app.db import metadata

metadata = MetaData()

parents = Table(
    "parents",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String),
    Column("email", String, unique=True),
    Column("password", String),
)

parent_students = Table(
    "parent_students",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("parent_id", Integer, ForeignKey("parents.id")),
    Column("student_id", Integer, ForeignKey("users.id")),
)

# ---------- USERS ----------
users = Table(
    "users",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("email", String, unique=True, nullable=False),
    Column("hashed_password", String, nullable=False),
    Column("full_name", String),
    Column("role", String, default="student"),  # student | teacher | admin
    Column("created_at", DateTime, server_default=func.now()),
)

# ---------- LESSONS ----------
lessons = Table(
    "lessons",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("title", String, nullable=False),
    Column("content", String, nullable=False),
    Column("reading_level", String, default="basic"),
    Column("created_at", DateTime, server_default=func.now()),
)

# ---------- READING SESSIONS ----------
reading_sessions = Table(
    "reading_sessions",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id")),
    Column("lesson_id", Integer, ForeignKey("lessons.id")),
    Column("spoken_text", String),
    Column("wpm", Integer),
    Column("accuracy", Integer),
    Column("errors", JSON),
    Column("recommendations", JSON),
    Column("created_at", DateTime, server_default=func.now()),
)

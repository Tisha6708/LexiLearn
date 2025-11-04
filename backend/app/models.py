from typing import Optional, Dict, Any
from datetime import datetime
from sqlmodel import SQLModel, Field, Column, JSON, ForeignKey


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, nullable=False, unique=True)
    hashed_password: str
    full_name: Optional[str] = None
    role: str = Field(default="student", nullable=False)
    progress: Optional[Dict[str, Any]] = Field(default_factory=dict, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Lesson(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    content: str
    reading_level: str = Field(default="basic")
    creator_id: Optional[int] = Field(default=None, foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ReadingSession(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", nullable=False)
    lesson_id: int = Field(foreign_key="lesson.id", nullable=False)
    spoken_text: str
    wpm: int
    accuracy: float
    errors: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    recommendations: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)

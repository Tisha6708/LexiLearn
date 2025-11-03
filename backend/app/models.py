from typing import Optional, Dict, Any
from sqlmodel import SQLModel, Field, Column, JSON

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, nullable=False, unique=True)
    hashed_password: str
    full_name: Optional[str] = None
    role: str = Field(default="student", nullable=False)  # student | parent | teacher
    # store user progress as JSON; fallback to text if DB doesn't support JSON
    progress: Optional[Dict[str, Any]] = Field(default_factory=dict, sa_column=Column(JSON))

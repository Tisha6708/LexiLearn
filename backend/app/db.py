from sqlmodel import create_engine, Session, SQLModel
from .config import settings

engine = create_engine(settings.DATABASE_URL, echo=False, connect_args={"check_same_thread": False})

def init_db():
    from .models import User, Lesson, ReadingSession
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

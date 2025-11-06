import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str = "replace-with-a-long-random-secret"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    DATABASE_URL: str = "sqlite:///./lexilearn.db"

settings = Settings()

if os.getenv("ENV") == "production":
    settings.DATABASE_URL = os.getenv("DATABASE_URL")

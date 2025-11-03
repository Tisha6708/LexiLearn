from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str = "replace-with-a-long-random-secret"  # change in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    DATABASE_URL: str = "sqlite:///./lexilearn.db"

settings = Settings()

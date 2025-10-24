from sqlalchemy import create_engine, MetaData
from databases import Database
from app.config import DATABASE_URL

# Async database for FastAPI
database = Database(DATABASE_URL)
metadata = MetaData()

# Synchronous engine for table creation
engine = create_engine(
    str(DATABASE_URL).replace("+aiosqlite", ""), connect_args={"check_same_thread": False}
)

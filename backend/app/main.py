from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import database, metadata, engine
from app.routers import health_router, auth_router, lesson_router, session_router, parent_router
from app import models

# Create DB tables (later we’ll add models)
from app.db import metadata, engine
from app import models  # this registers tables
metadata.create_all(engine)

app = FastAPI(title="LexiLearn Backend")

# CORS setup for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(health_router.router, prefix="/api", tags=["System"])
app.include_router(auth_router.router, prefix="/api/auth", tags=["Auth"])
app.include_router(lesson_router.router, prefix="/api/lessons", tags=["Lessons"])
app.include_router(session_router.router, prefix="/api/sessions", tags=["Reading Sessions"])
app.include_router(parent_router.router)

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.get("/")
def root():
    return {"message": "Welcome to LexiLearn API 💡"}

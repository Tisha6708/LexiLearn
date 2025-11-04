from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import init_db
from .routers import auth_router, user_router, lesson_router, session_router

app = FastAPI(title="LexiLearn API")

# Initialize the database
init_db()

origins = [
    "http://localhost:5173",  # your Vite dev server
    "http://127.0.0.1:5173",
]

# ✅ Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Register routers (no /api prefix)
app.include_router(auth_router.router)
app.include_router(user_router.router)
app.include_router(lesson_router.router)
app.include_router(session_router.router)

@app.get("/health")
def health():
    return {"status": "ok"}

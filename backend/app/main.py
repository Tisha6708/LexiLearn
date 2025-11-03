from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import init_db
from .routers import auth_router, user_router

app = FastAPI(title="LexiLearn API")

# Initialize the database
init_db()

# ✅ Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # you can later restrict this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Add global API prefix to all routes
app.include_router(auth_router.router)
app.include_router(user_router.router)

@app.get("/health")
def health():
    return {"status": "ok"}


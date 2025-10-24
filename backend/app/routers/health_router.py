from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
async def health_check():
    return {"status": "ok", "message": "LexiLearn backend is up and running 🚀"}

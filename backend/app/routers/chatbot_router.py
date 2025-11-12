from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Configure the Gemini API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Create the FastAPI router
router = APIRouter(prefix="/chatbot", tags=["Chatbot"])

# Initialize the Gemini model once
model = genai.GenerativeModel("gemini-2.5-flash")

# Define the request body
class ChatRequest(BaseModel):
    message: str

# Define the route
@router.post("/")
async def chatbot_route(request: ChatRequest):
    try:
        response = model.generate_content(request.message)
        return {"reply": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

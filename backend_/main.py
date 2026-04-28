"""
AI-Based Farmer Query Support and Advisory System
Backend API - FastAPI
Authors: Akshit Thakur, Kanav Sharma, Abhinav Sharma, Shivam Nagar,
         Mellamputi Sai Harshavardhan, Prashanth
Institution: Lovely Professional University, Jalandhar
"""
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from routers import farmers, crops, chatbot, activities, advisory, weather
from database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title="Farmer Advisory System API",
    description="""
    AI-powered backend for the Farmer Query Support and Advisory System.
    
    Features:
    - 🌾 Farmer & Farm Profile Management
    - 🌱 ML-Based Crop Recommendation (kNN, SVM, Random Forest)
    - 🤖 AI Chatbot (NLP-powered farming Q&A)
    - 📋 Activity Tracking (sowing, harvesting, pest events)
    - ☁️ Weather-based Proactive Advisory
    - 🐛 Pest & Disease Diagnosis
    """,
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(farmers.router,    prefix="/api/farmers",    tags=["Farmers & Profiles"])
app.include_router(crops.router,      prefix="/api/crops",      tags=["Crop Recommendation"])
app.include_router(chatbot.router,    prefix="/api/chatbot",    tags=["AI Chatbot"])
app.include_router(activities.router, prefix="/api/activities", tags=["Activity Tracking"])
app.include_router(advisory.router,   prefix="/api/advisory",   tags=["Personalized Advisory"])
app.include_router(weather.router,    prefix="/api/weather",    tags=["Weather"])


@app.get("/", tags=["Health"])
async def root():
    return {
        "status": "online",
        "service": "Farmer Advisory System API",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

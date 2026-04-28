"""
Pydantic schemas for request/response validation
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


# ─── Farmer Schemas ────────────────────────────────────────────────────────────

class FarmerCreate(BaseModel):
    name: str
    phone: str
    language: str = "english"
    state: str
    district: str
    village: Optional[str] = None
    farm_area_hectares: Optional[float] = None
    soil_type: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    nitrogen: Optional[float] = None
    phosphorus: Optional[float] = None
    potassium: Optional[float] = None
    ph: Optional[float] = None
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    rainfall: Optional[float] = None
    current_crops: Optional[str] = None


class FarmerUpdate(BaseModel):
    name: Optional[str] = None
    language: Optional[str] = None
    village: Optional[str] = None
    farm_area_hectares: Optional[float] = None
    soil_type: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    nitrogen: Optional[float] = None
    phosphorus: Optional[float] = None
    potassium: Optional[float] = None
    ph: Optional[float] = None
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    rainfall: Optional[float] = None
    current_crops: Optional[str] = None


class FarmerResponse(BaseModel):
    id: str
    name: str
    phone: str
    language: str
    state: str
    district: str
    village: Optional[str]
    farm_area_hectares: Optional[float]
    soil_type: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    nitrogen: Optional[float]
    phosphorus: Optional[float]
    potassium: Optional[float]
    ph: Optional[float]
    temperature: Optional[float]
    humidity: Optional[float]
    rainfall: Optional[float]
    current_crops: Optional[str]
    created_at: Optional[datetime]

    class Config:
        from_attributes = True


# ─── Crop Recommendation Schemas ───────────────────────────────────────────────

class CropRecommendationRequest(BaseModel):
    nitrogen: float = Field(..., ge=0, le=300, description="N content (kg/ha)")
    phosphorus: float = Field(..., ge=0, le=300, description="P content (kg/ha)")
    potassium: float = Field(..., ge=0, le=300, description="K content (kg/ha)")
    temperature: float = Field(..., ge=-10, le=60, description="Temperature (°C)")
    humidity: float = Field(..., ge=0, le=100, description="Humidity (%)")
    ph: float = Field(..., ge=0, le=14, description="Soil pH")
    rainfall: float = Field(..., ge=0, le=5000, description="Rainfall (mm)")
    farmer_id: Optional[str] = None


class CropRecommendation(BaseModel):
    crop: str
    confidence: float
    reason: str


class CropRecommendationResponse(BaseModel):
    top_recommendations: List[CropRecommendation]
    model_used: str
    input_summary: dict


# ─── Chatbot Schemas ────────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: str   # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    farmer_id: Optional[str] = None
    message: str
    language: str = "english"
    conversation_history: Optional[List[ChatMessage]] = []


class ChatResponse(BaseModel):
    reply: str
    language: str
    intent_detected: Optional[str] = None
    farmer_id: Optional[str] = None


# ─── Activity Schemas ───────────────────────────────────────────────────────────

class ActivityCreate(BaseModel):
    farmer_id: str
    activity_type: str
    crop_name: Optional[str] = None
    description: Optional[str] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None
    field_area: Optional[float] = None
    pest_name: Optional[str] = None
    severity: Optional[str] = None
    activity_date: datetime
    notes: Optional[str] = None


class ActivityResponse(BaseModel):
    id: str
    farmer_id: str
    activity_type: str
    crop_name: Optional[str]
    description: Optional[str]
    quantity: Optional[float]
    unit: Optional[str]
    field_area: Optional[float]
    pest_name: Optional[str]
    severity: Optional[str]
    activity_date: datetime
    notes: Optional[str]
    created_at: Optional[datetime]

    class Config:
        from_attributes = True


# ─── Pest Diagnosis Schemas ─────────────────────────────────────────────────────

class PestDiagnosisRequest(BaseModel):
    farmer_id: Optional[str] = None
    crop_name: str
    symptoms: str
    affected_area_percent: Optional[float] = None
    language: str = "english"


class PestDiagnosisResponse(BaseModel):
    diagnosis: str
    possible_pests: List[str]
    recommended_treatment: str
    severity_estimate: str
    prevention_tips: str


# ─── Advisory Schemas ───────────────────────────────────────────────────────────

class AdvisoryRequest(BaseModel):
    farmer_id: str
    include_weather: bool = True


class AdvisoryResponse(BaseModel):
    farmer_name: str
    alerts: List[str]
    recommendations: List[str]
    weather_summary: Optional[str]
    generated_at: datetime


# ─── Fertiliser Schemas ─────────────────────────────────────────────────────────

class FertiliserRequest(BaseModel):
    farmer_id: Optional[str] = None
    crop_name: str
    growth_stage: str   # e.g. "seedling", "vegetative", "flowering", "fruiting"
    current_n: Optional[float] = None
    current_p: Optional[float] = None
    current_k: Optional[float] = None
    language: str = "english"


class FertiliserResponse(BaseModel):
    crop: str
    growth_stage: str
    recommendations: str
    timing: str
    precautions: str

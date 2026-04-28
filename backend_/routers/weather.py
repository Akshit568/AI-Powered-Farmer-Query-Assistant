"""
Weather Router
7-day forecast and farming alerts using Open-Meteo (free, no API key).
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional

from services.weather_service import get_weather, generate_weather_alerts, summarize_weather

router = APIRouter()


@router.get("/forecast")
async def weather_forecast(
    latitude: float = Query(..., description="Farm latitude"),
    longitude: float = Query(..., description="Farm longitude"),
    current_crops: Optional[str] = Query(None, description="Comma-separated crop names for context-aware alerts"),
):
    """
    Get 7-day weather forecast + farming alerts for a location.
    Uses Open-Meteo (free, no API key required).
    """
    data = await get_weather(latitude, longitude)
    if not data:
        raise HTTPException(status_code=503, detail="Weather service unavailable.")

    alerts = generate_weather_alerts(data, current_crops)
    summary = summarize_weather(data)

    return {
        "summary": summary,
        "alerts": alerts,
        "current": data["current"],
        "forecast": data["forecast"],
    }

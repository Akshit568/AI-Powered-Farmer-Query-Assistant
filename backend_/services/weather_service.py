"""
Weather Advisory Service
Uses Open-Meteo (free, no API key) for weather data.
Generates proactive farming alerts based on forecasted conditions.
"""

import httpx
import logging
from datetime import datetime
from typing import Optional

logger = logging.getLogger(__name__)

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"


async def get_weather(latitude: float, longitude: float) -> Optional[dict]:
    """
    Fetch 7-day weather forecast from Open-Meteo (free, no key required).
    Returns structured forecast data.
    """
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "daily": [
            "temperature_2m_max", "temperature_2m_min",
            "precipitation_sum", "precipitation_probability_max",
            "windspeed_10m_max", "et0_fao_evapotranspiration",
        ],
        "current_weather": True,
        "timezone": "Asia/Kolkata",
        "forecast_days": 7,
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(OPEN_METEO_URL, params=params)
            resp.raise_for_status()
            data = resp.json()

        daily = data.get("daily", {})
        current = data.get("current_weather", {})

        dates          = daily.get("time", [])
        max_temps      = daily.get("temperature_2m_max", [])
        min_temps      = daily.get("temperature_2m_min", [])
        precip         = daily.get("precipitation_sum", [])
        precip_prob    = daily.get("precipitation_probability_max", [])
        wind           = daily.get("windspeed_10m_max", [])

        forecast_days = []
        for i in range(len(dates)):
            forecast_days.append({
                "date":            dates[i],
                "temp_max":        max_temps[i] if i < len(max_temps) else None,
                "temp_min":        min_temps[i] if i < len(min_temps) else None,
                "precipitation_mm": precip[i] if i < len(precip) else 0,
                "precip_prob_pct": precip_prob[i] if i < len(precip_prob) else 0,
                "wind_kmh":        wind[i] if i < len(wind) else None,
            })

        return {
            "current": {
                "temperature": current.get("temperature"),
                "windspeed":   current.get("windspeed"),
                "weather_code": current.get("weathercode"),
            },
            "forecast": forecast_days,
            "location": {"latitude": latitude, "longitude": longitude},
        }

    except Exception as e:
        logger.error(f"Weather fetch failed: {e}")
        return None


def generate_weather_alerts(weather_data: dict, current_crops: Optional[str] = None) -> list[str]:
    """
    Analyze forecast and generate actionable farming alerts.
    """
    alerts = []
    forecast = weather_data.get("forecast", [])
    crops = [c.strip().lower() for c in current_crops.split(",")] if current_crops else []

    for day in forecast[:3]:  # Check next 3 days
        date     = day.get("date", "")
        precip   = day.get("precipitation_mm", 0) or 0
        prob     = day.get("precip_prob_pct", 0) or 0
        temp_max = day.get("temp_max", 25) or 25
        temp_min = day.get("temp_min", 15) or 15
        wind     = day.get("wind_kmh", 0) or 0

        # Heavy rain alert
        if precip > 50 or prob > 80:
            alerts.append(
                f"⚠️ Heavy rain expected on {date} ({precip:.0f}mm, {prob}% chance). "
                "Avoid spraying pesticides or fertilisers. Ensure field drainage is clear."
            )

        # High wind - spraying warning
        if wind > 30:
            alerts.append(
                f"💨 Strong winds ({wind:.0f} km/h) forecast on {date}. "
                "Do not spray chemicals — risk of drift to neighbouring fields."
            )

        # Heat stress
        if temp_max > 40:
            alerts.append(
                f"🔥 Extreme heat ({temp_max}°C) expected on {date}. "
                "Irrigate in early morning or evening. Monitor crops for heat stress."
            )

        # Cold / frost warning
        if temp_min < 5:
            alerts.append(
                f"🥶 Near-frost temperatures ({temp_min}°C) forecast on {date}. "
                "Protect sensitive seedlings. Consider light irrigation before dawn to prevent frost damage."
            )

        # Drought advisory
        if precip < 2 and prob < 20:
            if "rice" in crops or "banana" in crops:
                alerts.append(
                    f"💧 No rain expected on {date}. High-water crops (rice, banana) "
                    "may need additional irrigation."
                )

    if not alerts:
        alerts.append("✅ Weather conditions look favourable for farming over the next 3 days.")

    return alerts


def summarize_weather(weather_data: dict) -> str:
    """Generate a one-paragraph weather summary for farmers."""
    current = weather_data.get("current", {})
    forecast = weather_data.get("forecast", [])

    if not forecast:
        return "Weather data unavailable."

    today = forecast[0] if forecast else {}
    week_rain = sum((d.get("precipitation_mm") or 0) for d in forecast)
    avg_max = sum((d.get("temp_max") or 25) for d in forecast) / max(len(forecast), 1)

    return (
        f"Current temperature: {current.get('temperature', 'N/A')}°C. "
        f"Today's forecast: {today.get('temp_min', 'N/A')}–{today.get('temp_max', 'N/A')}°C, "
        f"{today.get('precipitation_mm', 0):.0f}mm rain expected. "
        f"Weekly total rainfall: {week_rain:.0f}mm. "
        f"Average max temperature this week: {avg_max:.1f}°C."
    )

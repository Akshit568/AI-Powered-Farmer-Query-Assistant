"""
Personalized Advisory Router
Generates proactive, context-aware advice combining farmer profile,
recent activities, and weather forecast.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from database import get_db
from models.farmer import Farmer
from models.activity import Activity
from schemas import AdvisoryRequest, AdvisoryResponse
from services.weather_service import get_weather, generate_weather_alerts, summarize_weather

router = APIRouter()


@router.post("/generate", response_model=AdvisoryResponse)
async def generate_advisory(
    data: AdvisoryRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Generate a personalized advisory for a farmer.
    
    Combines:
    - Farmer's crop profile and soil data
    - Recent activity logs (last 7 days)
    - Live weather forecast (if lat/lng available)
    - Seasonal recommendations
    """
    # Load farmer
    result = await db.execute(select(Farmer).where(Farmer.id == data.farmer_id))
    farmer = result.scalar_one_or_none()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found.")

    recommendations = []
    alerts = []
    weather_summary = None

    # ── 1. Weather-based alerts ──────────────────────────────────────────────
    if data.include_weather and farmer.latitude and farmer.longitude:
        weather_data = await get_weather(farmer.latitude, farmer.longitude)
        if weather_data:
            weather_summary = summarize_weather(weather_data)
            weather_alerts = generate_weather_alerts(weather_data, farmer.current_crops)
            alerts.extend(weather_alerts)

    # ── 2. Soil-based recommendations ────────────────────────────────────────
    if farmer.ph is not None:
        if farmer.ph < 5.5:
            recommendations.append(
                "🌱 Your soil pH is acidic (below 5.5). Apply agricultural lime (calcium carbonate) "
                "at 1–2 tonnes/ha to improve nutrient availability."
            )
        elif farmer.ph > 8.0:
            recommendations.append(
                "🌱 Your soil pH is alkaline (above 8.0). Apply sulphur or organic compost "
                "to gradually lower pH for better nutrient uptake."
            )

    if farmer.nitrogen is not None and farmer.nitrogen < 30:
        recommendations.append(
            "🌿 Soil nitrogen is low. Consider applying urea (46-0-0) or organic manure "
            "before the next sowing cycle."
        )

    if farmer.potassium is not None and farmer.potassium < 20:
        recommendations.append(
            "🌿 Potassium levels are low. Apply MOP (muriate of potash) to improve "
            "crop quality and drought resistance."
        )

    # ── 3. Crop-based seasonal tips ──────────────────────────────────────────
    current_month = datetime.now().month
    if farmer.current_crops:
        crops = [c.strip().lower() for c in farmer.current_crops.split(",")]
        for crop in crops:
            tip = _seasonal_tip(crop, current_month)
            if tip:
                recommendations.append(f"🌾 {crop.title()}: {tip}")

    # ── 4. Recent pest activity check ────────────────────────────────────────
    recent_pests = await db.execute(
        select(Activity)
        .where(Activity.farmer_id == data.farmer_id)
        .where(Activity.activity_type == "pest_issue")
        .order_by(Activity.activity_date.desc())
        .limit(3)
    )
    pest_events = recent_pests.scalars().all()
    if pest_events:
        names = [e.pest_name for e in pest_events if e.pest_name]
        if names:
            alerts.append(
                f"🐛 You recently reported pest issues: {', '.join(set(names))}. "
                "Monitor your crops closely and consider consulting your local KVK."
            )

    # ── 5. Defaults ───────────────────────────────────────────────────────────
    if not recommendations:
        recommendations.append(
            "✅ Your farm profile looks good. Continue monitoring soil moisture and "
            "crop growth. Update your soil parameters after each season for better advice."
        )
    if not alerts:
        alerts.append("✅ No urgent alerts at this time.")

    return AdvisoryResponse(
        farmer_name=farmer.name,
        alerts=alerts,
        recommendations=recommendations,
        weather_summary=weather_summary,
        generated_at=datetime.now(),
    )


def _seasonal_tip(crop: str, month: int) -> str:
    """Return a month-appropriate tip for common crops."""
    tips = {
        "rice": {
            (6, 7, 8): "Ensure adequate flooding in paddy fields. Watch for blast disease during humid weather.",
            (9, 10): "Approaching harvest — drain fields 2 weeks before cutting. Check for stem borer.",
            (11, 12, 1): "Consider rabi crop rotation after harvest to maintain soil health.",
        },
        "wheat": {
            (11, 12): "Sowing season — ensure good seed bed preparation and basal fertiliser application.",
            (1, 2): "Apply top-dressing of nitrogen at tillering stage.",
            (3, 4): "Monitor for aphids and yellow rust. Harvest approaching.",
        },
        "cotton": {
            (5, 6): "Pre-sowing soil preparation and base fertiliser. Sow after first good rains.",
            (7, 8): "Peak growing season — monitor for pink bollworm and whitefly.",
            (10, 11): "Harvesting period. Pick bolls in dry weather to maintain fibre quality.",
        },
        "maize": {
            (6, 7): "Sowing time in kharif season. Apply phosphorus at planting.",
            (8, 9): "Tasselling stage — critical for irrigation. Watch for fall armyworm.",
            (10, 11): "Harvesting — dry cobs to below 14% moisture before storage.",
        },
    }
    crop_tips = tips.get(crop, {})
    for months, tip in crop_tips.items():
        if month in months:
            return tip
    return ""

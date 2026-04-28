"""
Crop Recommendation Router
ML-based crop recommendations using ensemble (RF + kNN + SVM).
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database import get_db
from models.farmer import Farmer
from schemas import CropRecommendationRequest, CropRecommendationResponse
from services.ml_service import recommend_crops

router = APIRouter()


@router.post("/recommend", response_model=CropRecommendationResponse)
async def get_crop_recommendation(
    data: CropRecommendationRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Get top crop recommendations based on soil and climate parameters.
    
    Input: NPK values, temperature, humidity, pH, rainfall.
    Uses an ensemble of Random Forest + kNN + SVM classifiers.
    """
    # If farmer_id provided, auto-fill missing params from their profile
    if data.farmer_id:
        result = await db.execute(select(Farmer).where(Farmer.id == data.farmer_id))
        farmer = result.scalar_one_or_none()
        if farmer:
            # Use profile values as fallback for any 0 inputs
            n = data.nitrogen or farmer.nitrogen or data.nitrogen
            p = data.phosphorus or farmer.phosphorus or data.phosphorus
            k = data.potassium or farmer.potassium or data.potassium
            temp = data.temperature or farmer.temperature or data.temperature
            hum = data.humidity or farmer.humidity or data.humidity
            ph = data.ph or farmer.ph or data.ph
            rain = data.rainfall or farmer.rainfall or data.rainfall
        else:
            n, p, k, temp, hum, ph, rain = (
                data.nitrogen, data.phosphorus, data.potassium,
                data.temperature, data.humidity, data.ph, data.rainfall,
            )
    else:
        n, p, k, temp, hum, ph, rain = (
            data.nitrogen, data.phosphorus, data.potassium,
            data.temperature, data.humidity, data.ph, data.rainfall,
        )

    try:
        recommendations = recommend_crops(n, p, k, temp, hum, ph, rain, top_k=3)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

    return CropRecommendationResponse(
        top_recommendations=recommendations,
        model_used="Ensemble (RandomForest + kNN + SVM)",
        input_summary={
            "N": n, "P": p, "K": k,
            "temperature": temp, "humidity": hum,
            "pH": ph, "rainfall": rain,
        },
    )


@router.get("/crops-list")
async def list_supported_crops():
    """Return list of all crops the ML model can recommend."""
    from services.ml_service import CROPS
    return {"crops": CROPS, "total": len(CROPS)}

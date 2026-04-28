"""
AI Chatbot Router
NLP-powered farming Q&A with multilingual support.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database import get_db
from models.farmer import Farmer
from schemas import (
    ChatRequest, ChatResponse,
    PestDiagnosisRequest, PestDiagnosisResponse,
    FertiliserRequest, FertiliserResponse,
)
from services.chatbot_service import (
    get_chatbot_response,
    diagnose_pest_or_disease,
    get_fertiliser_advice,
)

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat_with_advisor(
    data: ChatRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Chat with KisanMitra AI farming advisor.
    
    Supports multilingual input/output (English, Hindi, Malayalam, etc.).
    Provide farmer_id for personalized context-aware responses.
    """
    # Load farmer profile for context
    farmer_profile = None
    if data.farmer_id:
        result = await db.execute(select(Farmer).where(Farmer.id == data.farmer_id))
        farmer = result.scalar_one_or_none()
        if farmer:
            farmer_profile = {
                "name": farmer.name,
                "state": farmer.state,
                "district": farmer.district,
                "current_crops": farmer.current_crops,
                "soil_type": farmer.soil_type,
                "farm_area_hectares": farmer.farm_area_hectares,
            }
            # Use farmer's preferred language if not specified
            if data.language == "english" and farmer.language != "english":
                data.language = farmer.language

    history = [m.model_dump() for m in (data.conversation_history or [])]

    try:
        result = await get_chatbot_response(
            message=data.message,
            language=data.language,
            conversation_history=history,
            farmer_profile=farmer_profile,
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI service error: {str(e)}")

    return ChatResponse(
        reply=result["reply"],
        language=data.language,
        intent_detected=result["intent_detected"],
        farmer_id=data.farmer_id,
    )


@router.post("/diagnose-pest", response_model=PestDiagnosisResponse)
async def diagnose_pest(data: PestDiagnosisRequest):
    """
    Diagnose pest or disease based on described symptoms.
    Returns diagnosis, treatment recommendation, and prevention tips.
    """
    try:
        result = await diagnose_pest_or_disease(
            crop_name=data.crop_name,
            symptoms=data.symptoms,
            affected_area_percent=data.affected_area_percent,
            language=data.language,
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Diagnosis service error: {str(e)}")
    return result


@router.post("/fertiliser-advice", response_model=FertiliserResponse)
async def fertiliser_advice(data: FertiliserRequest):
    """
    Get fertiliser recommendations for a specific crop at a given growth stage.
    Considers current NPK levels if provided.
    """
    try:
        result = await get_fertiliser_advice(
            crop_name=data.crop_name,
            growth_stage=data.growth_stage,
            current_n=data.current_n,
            current_p=data.current_p,
            current_k=data.current_k,
            language=data.language,
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Advisory service error: {str(e)}")
    return result

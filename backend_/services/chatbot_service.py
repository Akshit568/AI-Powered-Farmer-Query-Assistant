"""
AI Chatbot Service - Uses Groq API (free tier, Llama 3.3 70B)
Supports multilingual responses (English, Hindi, Malayalam, etc.)
Intent detection: pest_control, crop_health, fertiliser, weather, general

Groq API is OpenAI-compatible, so we use the same message format.
Get your free API key at: https://console.groq.com
"""

import httpx
import json
import os
import logging
from typing import Optional

logger = logging.getLogger(__name__)

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "llama-3.3-70b-versatile"   # Free tier model on Groq

FARMING_SYSTEM_PROMPT = """You are an expert agricultural advisor AI assistant called "KisanMitra" (Farmer's Friend).
You help farmers in India with:
- Crop recommendations and cultivation practices
- Pest and disease identification and control
- Fertiliser application — timing, dosage, and type
- Irrigation advice
- Soil health management
- Weather-based farming decisions
- Post-harvest handling
- Government schemes and subsidies for farmers

Guidelines:
1. Always give practical, actionable advice specific to Indian farming conditions.
2. Respond in the same language the farmer uses. If asked in Hindi, reply in Hindi. If in Malayalam, reply in Malayalam. Default is English.
3. Use simple, jargon-free language that a rural farmer can understand.
4. When discussing chemicals or pesticides, always mention safety precautions.
5. If you're unsure, say so and recommend consulting a local Krishi Vigyan Kendra (KVK) or agricultural officer.
6. Be empathetic — farming is hard work and farmers face real economic pressures.
7. Keep responses concise and practical (under 300 words unless more detail is truly needed).

Always end responses with one actionable next step the farmer can take immediately.
"""

INTENT_KEYWORDS = {
    "pest_control":   ["pest", "insect", "bug", "disease", "fungus", "blight", "rot", "worm", "कीड़", "रोग"],
    "fertiliser":     ["fertiliser", "fertilizer", "npk", "urea", "manure", "खाद", "उर्वरक", "nutrition"],
    "crop_health":    ["crop", "plant", "leaf", "yield", "growth", "फसल", "पत्ता", "उगाना"],
    "irrigation":     ["water", "irrigation", "drip", "flood", "सिंचाई", "पानी"],
    "weather":        ["rain", "temperature", "frost", "drought", "flood", "मौसम", "बारिश"],
    "harvest":        ["harvest", "cut", "store", "sell", "market", "कटाई", "बाजार"],
}


def detect_intent(message: str) -> str:
    """Simple keyword-based intent detection."""
    message_lower = message.lower()
    for intent, keywords in INTENT_KEYWORDS.items():
        if any(kw in message_lower for kw in keywords):
            return intent
    return "general_farming"


def build_context_message(farmer_profile: Optional[dict]) -> str:
    """Build context string from farmer profile."""
    if not farmer_profile:
        return ""
    lines = ["Farmer context:"]
    if farmer_profile.get("name"):
        lines.append(f"- Name: {farmer_profile['name']}")
    if farmer_profile.get("district") and farmer_profile.get("state"):
        lines.append(f"- Location: {farmer_profile['district']}, {farmer_profile['state']}")
    if farmer_profile.get("current_crops"):
        lines.append(f"- Current crops: {farmer_profile['current_crops']}")
    if farmer_profile.get("soil_type"):
        lines.append(f"- Soil type: {farmer_profile['soil_type']}")
    if farmer_profile.get("farm_area_hectares"):
        lines.append(f"- Farm area: {farmer_profile['farm_area_hectares']} hectares")
    return "\n".join(lines)


def _get_headers() -> dict:
    """Build Groq API auth headers from environment variable."""
    api_key = os.getenv("GROQ_API_KEY", "")
    if not api_key:
        raise ValueError("GROQ_API_KEY is not set. Add it to your .env file.")
    return {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
    }


def _extract_reply(data: dict) -> str:
    """Extract text reply from Groq OpenAI-compatible response."""
    try:
        return data["choices"][0]["message"]["content"].strip()
    except (KeyError, IndexError) as e:
        logger.error(f"Unexpected Groq response format: {data}")
        raise ValueError(f"Could not parse Groq response: {e}")


async def get_chatbot_response(
    message: str,
    language: str = "english",
    conversation_history: Optional[list] = None,
    farmer_profile: Optional[dict] = None,
) -> dict:
    """
    Call Groq API (Llama 3.3 70B) to get farming advisory response.
    Returns dict with reply and intent_detected.
    """
    intent = detect_intent(message)
    context = build_context_message(farmer_profile)

    # Build system prompt
    system = FARMING_SYSTEM_PROMPT
    if language.lower() not in ("english", "en"):
        system += f"\n\nIMPORTANT: The farmer prefers responses in {language}. Respond in {language}."
    if context:
        system += f"\n\n{context}"

    # Groq uses OpenAI-format: system message is first in the messages array
    messages = [{"role": "system", "content": system}]
    if conversation_history:
        for msg in conversation_history[-6:]:   # last 3 turns
            messages.append({"role": msg["role"], "content": msg["content"]})
    messages.append({"role": "user", "content": message})

    payload = {
        "model": MODEL,
        "messages": messages,
        "max_tokens": 1000,
        "temperature": 0.7,
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            GROQ_API_URL,
            headers=_get_headers(),
            json=payload,
        )
        response.raise_for_status()
        data = response.json()

    return {
        "reply": _extract_reply(data),
        "intent_detected": intent,
    }


async def diagnose_pest_or_disease(
    crop_name: str,
    symptoms: str,
    affected_area_percent: Optional[float],
    language: str = "english",
) -> dict:
    """
    Specialized pest/disease diagnosis using Groq API.
    Returns structured JSON: diagnosis, possible_pests, treatment, severity, prevention.
    """
    area_info = f" About {affected_area_percent}% of the field is affected." if affected_area_percent else ""

    user_prompt = f"""A farmer is reporting a problem with their {crop_name} crop.
Symptoms described: {symptoms}.{area_info}

Please provide:
1. Most likely diagnosis (pest or disease name)
2. 2-3 possible causes
3. Recommended treatment (organic options first, then chemical if needed)
4. Estimated severity (low/medium/high)
5. Prevention tips for next season

Be specific and practical. {"Respond in " + language if language.lower() != "english" else ""}

Respond ONLY with a valid JSON object — no markdown, no extra text:
{{
  "diagnosis": "...",
  "possible_pests": ["...", "..."],
  "recommended_treatment": "...",
  "severity_estimate": "low|medium|high",
  "prevention_tips": "..."
}}"""

    messages = [
        {
            "role": "system",
            "content": (
                "You are an expert plant pathologist and pest management specialist for Indian agriculture. "
                "Provide accurate, practical diagnosis and treatment advice. Always mention chemical safety precautions. "
                "Always respond with valid JSON only — no markdown, no code fences, no preamble."
            ),
        },
        {"role": "user", "content": user_prompt},
    ]

    payload = {
        "model": MODEL,
        "messages": messages,
        "max_tokens": 1000,
        "temperature": 0.3,   # Lower temp for structured JSON output
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            GROQ_API_URL,
            headers=_get_headers(),
            json=payload,
        )
        response.raise_for_status()
        data = response.json()

    raw = _extract_reply(data)

    try:
        clean = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        parsed = json.loads(clean)
        return {
            "diagnosis":             parsed.get("diagnosis", "Unknown"),
            "possible_pests":        parsed.get("possible_pests", []),
            "recommended_treatment": parsed.get("recommended_treatment", raw),
            "severity_estimate":     parsed.get("severity_estimate", "medium"),
            "prevention_tips":       parsed.get("prevention_tips", ""),
        }
    except Exception:
        return {
            "diagnosis":             "See detailed response below",
            "possible_pests":        [],
            "recommended_treatment": raw,
            "severity_estimate":     "medium",
            "prevention_tips":       "",
        }


async def get_fertiliser_advice(
    crop_name: str,
    growth_stage: str,
    current_n: Optional[float],
    current_p: Optional[float],
    current_k: Optional[float],
    language: str = "english",
) -> dict:
    """
    Generate fertiliser recommendation using Groq API.
    Returns structured JSON: recommendations, timing, precautions.
    """
    npk_info = ""
    if any(v is not None for v in [current_n, current_p, current_k]):
        npk_info = (
            f" Current soil NPK: "
            f"N={current_n or 'unknown'}, "
            f"P={current_p or 'unknown'}, "
            f"K={current_k or 'unknown'} kg/ha."
        )

    user_prompt = f"""Provide a fertiliser recommendation for {crop_name} at the {growth_stage} growth stage.{npk_info}

Include:
1. Recommended fertiliser type and dose (kg/ha)
2. Application timing and method
3. Precautions and common mistakes to avoid

{"Respond in " + language + "." if language.lower() != "english" else ""}

Respond ONLY with a valid JSON object — no markdown, no extra text:
{{
  "recommendations": "...",
  "timing": "...",
  "precautions": "..."
}}"""

    messages = [
        {
            "role": "system",
            "content": (
                "You are an expert agronomist specializing in crop nutrition and fertiliser management "
                "for Indian agriculture. Provide specific, practical recommendations. "
                "Always respond with valid JSON only — no markdown, no code fences, no preamble."
            ),
        },
        {"role": "user", "content": user_prompt},
    ]

    payload = {
        "model": MODEL,
        "messages": messages,
        "max_tokens": 800,
        "temperature": 0.3,
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            GROQ_API_URL,
            headers=_get_headers(),
            json=payload,
        )
        response.raise_for_status()
        data = response.json()

    raw = _extract_reply(data)

    try:
        clean = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        parsed = json.loads(clean)
        return {
            "crop":            crop_name,
            "growth_stage":    growth_stage,
            "recommendations": parsed.get("recommendations", raw),
            "timing":          parsed.get("timing", ""),
            "precautions":     parsed.get("precautions", ""),
        }
    except Exception:
        return {
            "crop":            crop_name,
            "growth_stage":    growth_stage,
            "recommendations": raw,
            "timing":          "",
            "precautions":     "",
        }

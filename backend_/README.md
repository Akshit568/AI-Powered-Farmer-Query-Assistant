# 🌾 AI-Based Farmer Query Support and Advisory System — Backend API

> **Research Paper Implementation**  
> Authors: Akshit Thakur, Kanav Sharma, Abhinav Sharma, Shivam Nagar, Mellamputi Sai Harshavardhan, Prashanth  
> Institution: Lovely Professional University, Jalandhar, India

---

## Overview

This is the full FastAPI backend for the **AI-Based Farmer Query Support and Advisory System** described in the research paper. It implements all six core features of the proposed system:

| # | Feature | Endpoint Prefix |
|---|---------|----------------|
| 1 | Farmer & Farm Profile Management | `/api/farmers` |
| 2 | AI Chatbot (NLP-powered, multilingual) | `/api/chatbot/chat` |
| 3 | Activity Tracking (sowing, pest events, etc.) | `/api/activities` |
| 4 | Personalized Advisory (proactive alerts) | `/api/advisory` |
| 5 | Weather-based Alerts | `/api/weather` |
| 6 | ML Crop Recommendation (RF + kNN + SVM) | `/api/crops/recommend` |

---

## Architecture

```
farmer-advisory/
├── main.py                  # FastAPI app entry point
├── database.py              # SQLAlchemy async + SQLite
├── schemas.py               # Pydantic request/response models
├── requirements.txt
├── .env.example
│
├── models/
│   ├── farmer.py            # Farmer & Farm Profile ORM
│   └── activity.py          # Activity Tracking ORM
│
├── routers/
│   ├── farmers.py           # CRUD: farmer profiles
│   ├── crops.py             # ML crop recommendation
│   ├── chatbot.py           # AI chat, pest diagnosis, fertiliser advice
│   ├── activities.py        # Activity log CRUD
│   ├── advisory.py          # Personalized advisory generation
│   └── weather.py           # 7-day forecast + farming alerts
│
├── services/
│   ├── ml_service.py        # scikit-learn ensemble model
│   ├── chatbot_service.py   # Claude API integration (KisanMitra)
│   └── weather_service.py   # Open-Meteo integration
│
└── ml/
    └── crop_model.pkl       # Auto-generated on first run
```

---

## Quick Start

### 1. Clone & Install

```bash
# Navigate to project
cd farmer-advisory

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Linux/Mac)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Copy the example env file
copy .env.example .env        # Windows
cp .env.example .env          # Linux/Mac

# Edit .env and add your Anthropic API key
ANTHROPIC_API_KEY=your_key_here
```

### 3. Run the Server

```bash
python -m uvicorn main:app --reload --port 8000
```

The ML model trains automatically on first startup (~5 seconds).

### 4. Explore the API

Open your browser at: **http://localhost:8000/docs**

---

## API Reference

### 👨‍🌾 Farmer Profiles

```http
POST   /api/farmers/              Register new farmer
GET    /api/farmers/              List all farmers
GET    /api/farmers/{id}          Get farmer profile
PATCH  /api/farmers/{id}          Update profile
DELETE /api/farmers/{id}          Delete farmer
```

**Register a farmer (example):**
```json
POST /api/farmers/
{
  "name": "Rajesh Kumar",
  "phone": "9876543210",
  "language": "hindi",
  "state": "Punjab",
  "district": "Ludhiana",
  "farm_area_hectares": 2.5,
  "soil_type": "alluvial",
  "nitrogen": 85,
  "phosphorus": 42,
  "potassium": 35,
  "ph": 6.8,
  "temperature": 26,
  "humidity": 65,
  "rainfall": 90,
  "current_crops": "wheat, mustard"
}
```

---

### 🌱 Crop Recommendation (ML)

```http
POST /api/crops/recommend         Get top 3 crop recommendations
GET  /api/crops/crops-list        List all 23 supported crops
```

**Request:**
```json
{
  "nitrogen": 85,
  "phosphorus": 42,
  "potassium": 35,
  "temperature": 26,
  "humidity": 65,
  "ph": 6.8,
  "rainfall": 90,
  "farmer_id": "optional-uuid"
}
```

**Response:**
```json
{
  "top_recommendations": [
    {
      "crop": "wheat",
      "confidence": 87.4,
      "reason": "Nitrogen (85 kg/ha) is in the ideal range. Soil pH is in the ideal range. Temperature (26°C) is in the ideal range."
    },
    ...
  ],
  "model_used": "Ensemble (RandomForest + kNN + SVM)"
}
```

---

### 🤖 AI Chatbot (KisanMitra)

```http
POST /api/chatbot/chat              General farming Q&A
POST /api/chatbot/diagnose-pest     Pest & disease diagnosis
POST /api/chatbot/fertiliser-advice Fertiliser recommendations
```

**Chat example:**
```json
POST /api/chatbot/chat
{
  "farmer_id": "uuid-here",
  "message": "My rice crop leaves are turning yellow. What should I do?",
  "language": "english",
  "conversation_history": []
}
```

**Pest diagnosis example:**
```json
POST /api/chatbot/diagnose-pest
{
  "crop_name": "tomato",
  "symptoms": "Small white flies on leaves, sticky residue, yellowing",
  "affected_area_percent": 30,
  "language": "hindi"
}
```

**Fertiliser advice example:**
```json
POST /api/chatbot/fertiliser-advice
{
  "crop_name": "wheat",
  "growth_stage": "tillering",
  "current_n": 60,
  "current_p": 40,
  "current_k": 30
}
```

---

### 📋 Activity Tracking

```http
POST /api/activities/                          Log an activity
GET  /api/activities/farmer/{id}               Get farmer's activities
GET  /api/activities/farmer/{id}/pest-summary  Pest event summary
DELETE /api/activities/{activity_id}           Delete entry
```

**Log a pest event:**
```json
POST /api/activities/
{
  "farmer_id": "uuid",
  "activity_type": "pest_issue",
  "crop_name": "cotton",
  "pest_name": "pink bollworm",
  "severity": "medium",
  "affected_area_percent": 20,
  "activity_date": "2025-08-15T10:00:00",
  "notes": "Observed on southern side of field"
}
```

**Activity types:** `sowing`, `harvesting`, `irrigation`, `fertiliser`, `pest_issue`, `spraying`, `soil_test`, `other`

---

### ☁️ Weather

```http
GET /api/weather/forecast?latitude=30.9&longitude=75.8&current_crops=wheat,mustard
```

**Response includes:**
- Current temperature and wind
- 7-day forecast (temp, rainfall, wind)
- Farming-specific alerts (spray warnings, heat stress, frost)
- Contextual alerts based on crops being grown

---

### 📊 Personalized Advisory

```http
POST /api/advisory/generate
{
  "farmer_id": "uuid",
  "include_weather": true
}
```

Generates a combined advisory report with:
- Weather-based alerts
- Soil health recommendations (based on NPK and pH)
- Crop-season specific tips
- Recent pest activity alerts

---

## ML Model Details

The crop recommendation engine uses a **Voting Classifier ensemble**:

| Model | Role |
|-------|------|
| Random Forest (100 trees) | Primary classifier, handles non-linear boundaries |
| k-Nearest Neighbours (k=5) | Local pattern matching |
| SVM (RBF kernel) | High-dimensional margin classification |

**Features:** N, P, K (kg/ha) · Temperature (°C) · Humidity (%) · Soil pH · Rainfall (mm)  
**Classes:** 23 crops (rice, wheat, maize, cotton, coffee, banana, mango, and more)  
**Training:** Synthetic data generated from agronomic reference profiles  
**Model persistence:** Auto-saved to `ml/crop_model.pkl` on first run

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Framework | FastAPI |
| Database | SQLAlchemy Async + SQLite (swap to PostgreSQL for production) |
| ML | scikit-learn (RF + kNN + SVM ensemble) |
| AI Chatbot | Claude API (claude-sonnet) |
| Weather | Open-Meteo (free, no API key needed) |
| Validation | Pydantic v2 |
| Server | Uvicorn |

---

## Switching to PostgreSQL (Production)

Update your `.env`:
```
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/farmer_advisory
```

Add the driver:
```bash
pip install asyncpg
```

---

## Supported Languages (Chatbot)

The KisanMitra chatbot responds in the farmer's preferred language:
- English
- Hindi (हिंदी)
- Malayalam (മലയാളം)
- Punjabi (ਪੰਜਾਬੀ)
- Any other language supported by Claude

Set `language` in chat requests or set it in the farmer's profile for automatic detection.

---

## Citation

If using this code for academic work, please cite:

> Akshit Thakur et al., "AI-Based Farmer Query Support and Advisory System,"  
> Lovely Professional University, Jalandhar, India, 2025.

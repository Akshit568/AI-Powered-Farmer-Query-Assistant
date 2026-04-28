"""
Farmer & Farm Profile ORM Model
"""

from sqlalchemy import Column, String, Float, Integer, DateTime, Text, Enum
from sqlalchemy.sql import func
import uuid
import enum

from database import Base


class SoilType(str, enum.Enum):
    ALLUVIAL   = "alluvial"
    BLACK      = "black"
    RED        = "red"
    LATERITE   = "laterite"
    SANDY      = "sandy"
    CLAY       = "clay"
    LOAMY      = "loamy"


class Farmer(Base):
    __tablename__ = "farmers"

    id           = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name         = Column(String(100), nullable=False)
    phone        = Column(String(15), unique=True, nullable=False)
    language     = Column(String(20), default="english")   # e.g. "malayalam", "hindi"
    state        = Column(String(50), nullable=False)
    district     = Column(String(50), nullable=False)
    village      = Column(String(100), nullable=True)

    # Farm profile
    farm_area_hectares = Column(Float, nullable=True)          # total farm size
    soil_type          = Column(String(20), nullable=True)     # SoilType enum value
    latitude           = Column(Float, nullable=True)
    longitude          = Column(Float, nullable=True)

    # Soil parameters (NPK + pH)
    nitrogen    = Column(Float, nullable=True)   # kg/ha
    phosphorus  = Column(Float, nullable=True)   # kg/ha
    potassium   = Column(Float, nullable=True)   # kg/ha
    ph          = Column(Float, nullable=True)   # 0–14
    temperature = Column(Float, nullable=True)   # °C
    humidity    = Column(Float, nullable=True)   # %
    rainfall    = Column(Float, nullable=True)   # mm

    # Current crops
    current_crops = Column(Text, nullable=True)  # comma-separated

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

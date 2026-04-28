"""
Activity Tracking ORM Model
Tracks: sowing, harvesting, irrigation, fertiliser, pest events, spraying
"""

from sqlalchemy import Column, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
import uuid
import enum

from database import Base


class ActivityType(str, enum.Enum):
    SOWING       = "sowing"
    HARVESTING   = "harvesting"
    IRRIGATION   = "irrigation"
    FERTILISER   = "fertiliser"
    PEST_ISSUE   = "pest_issue"
    SPRAYING     = "spraying"
    SOIL_TEST    = "soil_test"
    OTHER        = "other"


class Activity(Base):
    __tablename__ = "activities"

    id          = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    farmer_id   = Column(String, ForeignKey("farmers.id"), nullable=False, index=True)

    activity_type = Column(String(30), nullable=False)   # ActivityType enum value
    crop_name     = Column(String(100), nullable=True)
    description   = Column(Text, nullable=True)
    quantity      = Column(Float, nullable=True)         # e.g. kg of fertiliser
    unit          = Column(String(20), nullable=True)    # kg / litre / etc.
    field_area    = Column(Float, nullable=True)         # hectares affected

    # For pest/disease events
    pest_name     = Column(String(100), nullable=True)
    severity      = Column(String(20), nullable=True)    # low / medium / high

    activity_date = Column(DateTime(timezone=True), nullable=False)
    notes         = Column(Text, nullable=True)
    created_at    = Column(DateTime(timezone=True), server_default=func.now())

"""
Activity Tracking Router
Log and retrieve farm activities: sowing, pest events, irrigation, fertiliser, etc.
This data feeds the continuous learning loop described in the paper.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from datetime import datetime

from database import get_db
from models.activity import Activity
from schemas import ActivityCreate, ActivityResponse

router = APIRouter()


@router.post("/", response_model=ActivityResponse, status_code=status.HTTP_201_CREATED)
async def log_activity(data: ActivityCreate, db: AsyncSession = Depends(get_db)):
    """
    Log a farm activity (sowing, pest issue, fertiliser application, etc.).
    These logs are used to build the farmer's 'invisible profile' for personalized advice.
    """
    activity = Activity(**data.model_dump())
    db.add(activity)
    await db.commit()
    await db.refresh(activity)
    return activity


@router.get("/farmer/{farmer_id}", response_model=List[ActivityResponse])
async def get_farmer_activities(
    farmer_id: str,
    activity_type: Optional[str] = Query(None, description="Filter by type: sowing, pest_issue, etc."),
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
):
    """Get all activities for a farmer, with optional filters."""
    query = select(Activity).where(Activity.farmer_id == farmer_id)

    if activity_type:
        query = query.where(Activity.activity_type == activity_type)
    if from_date:
        query = query.where(Activity.activity_date >= from_date)
    if to_date:
        query = query.where(Activity.activity_date <= to_date)

    query = query.order_by(Activity.activity_date.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{activity_id}", response_model=ActivityResponse)
async def get_activity(activity_id: str, db: AsyncSession = Depends(get_db)):
    """Get a specific activity log entry."""
    result = await db.execute(select(Activity).where(Activity.id == activity_id))
    activity = result.scalar_one_or_none()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found.")
    return activity


@router.delete("/{activity_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_activity(activity_id: str, db: AsyncSession = Depends(get_db)):
    """Delete an activity log entry."""
    result = await db.execute(select(Activity).where(Activity.id == activity_id))
    activity = result.scalar_one_or_none()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found.")
    await db.delete(activity)
    await db.commit()


@router.get("/farmer/{farmer_id}/pest-summary")
async def pest_summary(farmer_id: str, db: AsyncSession = Depends(get_db)):
    """
    Summary of pest/disease events for a farmer.
    Used for proactive nearby-outbreak alerts.
    """
    query = (
        select(Activity)
        .where(Activity.farmer_id == farmer_id)
        .where(Activity.activity_type == "pest_issue")
        .order_by(Activity.activity_date.desc())
        .limit(20)
    )
    result = await db.execute(query)
    events = result.scalars().all()

    from collections import Counter
    pest_counts = Counter(
        e.pest_name for e in events if e.pest_name
    )
    return {
        "total_pest_events": len(events),
        "most_common_pests": dict(pest_counts.most_common(5)),
        "recent_events": [
            {
                "date": e.activity_date.isoformat(),
                "pest": e.pest_name,
                "crop": e.crop_name,
                "severity": e.severity,
            }
            for e in events[:5]
        ],
    }

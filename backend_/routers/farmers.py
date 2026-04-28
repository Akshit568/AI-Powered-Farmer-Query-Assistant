"""
Farmers & Farm Profile Router
CRUD operations for farmer registration and profile management.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from database import get_db
from models.farmer import Farmer
from schemas import FarmerCreate, FarmerUpdate, FarmerResponse

router = APIRouter()


@router.post("/", response_model=FarmerResponse, status_code=status.HTTP_201_CREATED)
async def register_farmer(data: FarmerCreate, db: AsyncSession = Depends(get_db)):
    """Register a new farmer and their farm profile."""
    # Check phone uniqueness
    existing = await db.execute(select(Farmer).where(Farmer.phone == data.phone))
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Farmer with phone {data.phone} already exists.",
        )
    farmer = Farmer(**data.model_dump())
    db.add(farmer)
    await db.commit()
    await db.refresh(farmer)
    return farmer


@router.get("/", response_model=List[FarmerResponse])
async def list_farmers(
    state: str = None,
    district: str = None,
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
):
    """List all farmers, optionally filtered by state/district."""
    query = select(Farmer)
    if state:
        query = query.where(Farmer.state == state)
    if district:
        query = query.where(Farmer.district == district)
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{farmer_id}", response_model=FarmerResponse)
async def get_farmer(farmer_id: str, db: AsyncSession = Depends(get_db)):
    """Get a farmer's full profile by ID."""
    result = await db.execute(select(Farmer).where(Farmer.id == farmer_id))
    farmer = result.scalar_one_or_none()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found.")
    return farmer


@router.patch("/{farmer_id}", response_model=FarmerResponse)
async def update_farmer(farmer_id: str, data: FarmerUpdate, db: AsyncSession = Depends(get_db)):
    """Update farmer profile (partial update)."""
    result = await db.execute(select(Farmer).where(Farmer.id == farmer_id))
    farmer = result.scalar_one_or_none()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found.")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(farmer, field, value)

    await db.commit()
    await db.refresh(farmer)
    return farmer


@router.delete("/{farmer_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_farmer(farmer_id: str, db: AsyncSession = Depends(get_db)):
    """Delete a farmer profile."""
    result = await db.execute(select(Farmer).where(Farmer.id == farmer_id))
    farmer = result.scalar_one_or_none()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found.")
    await db.delete(farmer)
    await db.commit()

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.api import deps
from app.models.property import Property as PropertyModel
from app.schemas.property import Property, PropertyCreate, PropertyUpdate

router = APIRouter()

@router.get("/", response_model=List[Property])
def read_properties(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    properties = db.query(PropertyModel).offset(skip).limit(limit).all()
    return properties

@router.post("/", response_model=Property)
def create_property(
    *,
    db: Session = Depends(deps.get_db),
    property_in: PropertyCreate,
):
    property = PropertyModel(
        **property_in.model_dump()
    )
    db.add(property)
    db.commit()
    db.refresh(property)
    return property

@router.get("/{id}", response_model=Property)
def read_property(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
):
    property = db.query(PropertyModel).filter(PropertyModel.id == id).first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    return property

@router.put("/{id}", response_model=Property)
def update_property(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    property_in: PropertyUpdate,
):
    property = db.query(PropertyModel).filter(PropertyModel.id == id).first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    
    update_data = property_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(property, field, value)
    
    db.add(property)
    db.commit()
    db.refresh(property)
    return property

@router.delete("/{id}", response_model=Property)
def delete_property(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
):
    property = db.query(PropertyModel).filter(PropertyModel.id == id).first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    
    db.delete(property)
    db.commit()
    return property

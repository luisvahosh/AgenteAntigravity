from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class PropertyBase(BaseModel):
    title: str
    description: Optional[str] = None
    price: float
    address: str
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    area_sqm: Optional[float] = None
    type: str
    status: Optional[str] = "available"
    owner_id: Optional[UUID] = None  # New field

class PropertyCreate(PropertyBase):
    pass

class PropertyUpdate(PropertyBase):
    pass

class Property(PropertyBase):
    id: int
    
    # For display purposes (optional, if we want to embed owner details later)
    # owner: Optional[Client] = None 

    class Config:
        from_attributes = True

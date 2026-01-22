from sqlalchemy import Column, Integer, String, Float, Text, Enum, ForeignKey
from sqlalchemy.types import Uuid
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    address = Column(String, nullable=False)
    bedrooms = Column(Integer, nullable=True)
    bathrooms = Column(Integer, nullable=True)
    area_sqm = Column(Float, nullable=True)
    type = Column(String, nullable=False) # e.g., 'sale', 'rent'
    status = Column(String, default='available') # e.g., 'available', 'sold', 'rented'
    
    # New: Link to Owner (Client)
    # Using nullable=True for now to allow properties without explicit owner if needed, or migration safety
    owner_id = Column(Uuid(as_uuid=True), ForeignKey("clients.id"), nullable=True)
    
    owner = relationship("Client")

from sqlalchemy import Column, Integer, String, Float, Text, TIMESTAMP, text, ForeignKey
from sqlalchemy.types import Uuid
from sqlalchemy.orm import relationship
import uuid
from app.db.base_class import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # Correctly linking to Property.id (Integer)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)
    
    # Correctly linking to Client.id (UUID)
    client_id = Column(Uuid(as_uuid=True), ForeignKey("clients.id"), nullable=False)
    
    type = Column(String, nullable=False) # sale, rent
    amount = Column(Float, nullable=False)
    date = Column(TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP"))
    notes = Column(Text, nullable=True)

    # Relationships
    property = relationship("Property")
    client = relationship("Client")

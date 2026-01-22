from sqlalchemy import Column, String, Boolean, TIMESTAMP, text, JSON
from sqlalchemy.types import Uuid
from sqlalchemy.orm import relationship
import uuid
from app.db.base_class import Base

class Tenant(Base):
    __tablename__ = "tenant"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    subdomain = Column(String, unique=True, index=True, nullable=False)
    branding = Column(JSON, nullable=True) # Logo, colors
    subscription_plan = Column(String, default="standard")
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP")) # generic now()

    users = relationship("User", back_populates="tenant")

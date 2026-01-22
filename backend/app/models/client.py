from sqlalchemy import Column, String, Boolean, Text, TIMESTAMP, text
from sqlalchemy.types import Uuid
import uuid
from app.db.base_class import Base

class Client(Base):
    __tablename__ = "clients"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=True)
    status = Column(String, default="active") # active, inactive
    notes = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP"))

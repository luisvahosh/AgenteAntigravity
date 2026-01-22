from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.types import Uuid
from sqlalchemy.orm import relationship
import uuid
from app.db.base_class import Base
import enum

class UserRole(str, enum.Enum):
    SUPERADMIN = "superadmin"
    ADMIN = "admin"
    MANAGER = "manager"
    AGENT = "agent"
    LEGAL = "legal"
    FINANCE = "finance"

class User(Base):
    __tablename__ = "user" # Ensure tablename is explicit if not in Base

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False, default=UserRole.AGENT) 
    is_active = Column(Boolean, default=True)
    tenant_id = Column(Uuid(as_uuid=True), ForeignKey("tenant.id"), nullable=False)

    tenant = relationship("Tenant", back_populates="users")

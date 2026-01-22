from pydantic import BaseModel
from typing import Optional, Any
from uuid import UUID
from datetime import datetime

class TenantBase(BaseModel):
    name: str
    subdomain: Optional[str] = None
    branding: Optional[Any] = None

class TenantUpdate(TenantBase):
    pass

class TenantInDBBase(TenantBase):
    id: UUID
    subscription_plan: str
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Tenant(TenantInDBBase):
    pass

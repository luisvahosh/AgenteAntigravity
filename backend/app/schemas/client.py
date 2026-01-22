from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID
from datetime import datetime

class ClientBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    status: Optional[str] = "active"
    notes: Optional[str] = None
    is_active: Optional[bool] = True

class ClientCreate(ClientBase):
    pass

class ClientUpdate(ClientBase):
    name: Optional[str] = None
    email: Optional[EmailStr] = None

class ClientInDBBase(ClientBase):
    id: UUID
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Client(ClientInDBBase):
    pass

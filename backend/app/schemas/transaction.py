from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class TransactionBase(BaseModel):
    property_id: int
    client_id: UUID
    type: str # sale, rent
    amount: float
    notes: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class TransactionInDBBase(TransactionBase):
    id: UUID
    date: Optional[datetime] = None

    class Config:
        from_attributes = True

class Transaction(TransactionInDBBase):
    pass

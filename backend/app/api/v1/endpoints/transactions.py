from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Any
from uuid import UUID

from app.api import deps
from app.models.transaction import Transaction as TransactionModel
from app.models.property import Property as PropertyModel
from app.schemas.transaction import Transaction, TransactionCreate

router = APIRouter()

@router.get("/", response_model=List[Transaction])
def read_transactions(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    transactions = db.query(TransactionModel).offset(skip).limit(limit).all()
    return transactions

@router.post("/", response_model=Transaction)
def create_transaction(
    *,
    db: Session = Depends(deps.get_db),
    transaction_in: TransactionCreate,
):
    # Verify property exists
    property = db.query(PropertyModel).filter(PropertyModel.id == transaction_in.property_id).first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
        
    transaction = TransactionModel(
        **transaction_in.model_dump()
    )
    db.add(transaction)
    
    # Auto-update property status if sold/rented
    if transaction_in.type == 'sale':
        property.status = 'sold'
    elif transaction_in.type == 'rent':
        property.status = 'rented'
        
    db.add(property)
    db.commit()
    db.refresh(transaction)
    return transaction

@router.get("/summary", response_model=Any)
def get_transaction_summary(
    db: Session = Depends(deps.get_db),
):
    # Total revenue
    total_revenue = db.query(func.sum(TransactionModel.amount)).scalar() or 0
    
    # Count by type
    sales_count = db.query(TransactionModel).filter(TransactionModel.type == "sale").count()
    rentals_count = db.query(TransactionModel).filter(TransactionModel.type == "rent").count()
    
    # Revenue by month (simple grouping by formatted date string if supported, or just return raw list for frontend processing)
    # For SQLite, date handling can be tricky. Let's return last 5 transactions for now and let frontend graph them.
    recent_transactions = db.query(TransactionModel).order_by(TransactionModel.date.desc()).limit(5).all()
    
    return {
        "total_revenue": total_revenue,
        "sales_count": sales_count,
        "rentals_count": rentals_count,
        "recent_transactions": [Transaction.model_validate(t) for t in recent_transactions]
    }

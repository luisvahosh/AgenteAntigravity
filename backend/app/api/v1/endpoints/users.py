from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from passlib.context import CryptContext

from app.api import deps
from app.models.user import User as UserModel
from app.models.tenant import Tenant as TenantModel
from app.schemas.user import User, UserCreate

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

@router.get("/", response_model=List[User])
def read_users(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    # In a real app, filter by current tenant from auth token
    # For now, we'll just get the first tenant's users or all users
    # To make it realistic, let's fetch the default tenant first
    tenant = db.query(TenantModel).first()
    if not tenant:
        return []
        
    users = db.query(UserModel).filter(UserModel.tenant_id == tenant.id).offset(skip).limit(limit).all()
    return users

@router.post("/", response_model=User)
def create_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: UserCreate,
):
    # 1. Get current tenant (simulated single tenant)
    tenant = db.query(TenantModel).first()
    if not tenant:
        raise HTTPException(status_code=400, detail="No tenant configured. Please update settings first.")

    # 2. Check if email exists
    user = db.query(UserModel).filter(UserModel.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
        
    # 3. Create user
    user = UserModel(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        role=user_in.role,
        is_active=user_in.is_active,
        tenant_id=tenant.id
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

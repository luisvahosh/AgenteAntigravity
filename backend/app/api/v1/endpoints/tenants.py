from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.tenant import Tenant as TenantModel
from app.schemas.tenant import Tenant, TenantUpdate

router = APIRouter()

@router.get("/me", response_model=Tenant)
def read_current_tenant(
    db: Session = Depends(deps.get_db),
):
    # For this SaaS MVP, we assume single tenant or first tenant found.
    # In a real multi-tenant app, this would be derived from the user token or subdomain.
    tenant = db.query(TenantModel).first()
    
    if not tenant:
        # Create default tenant if none exists (for dev convenience)
        tenant = TenantModel(
            name="Mi Agencia Inmobiliaria",
            subdomain="mi-agencia",
            subscription_plan="pro"
        )
        db.add(tenant)
        db.commit()
        db.refresh(tenant)
        
    return tenant

@router.put("/me", response_model=Tenant)
def update_current_tenant(
    *,
    db: Session = Depends(deps.get_db),
    tenant_in: TenantUpdate,
):
    tenant = db.query(TenantModel).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
        
    update_data = tenant_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(tenant, field, value)
        
    db.add(tenant)
    db.commit()
    db.refresh(tenant)
    return tenant

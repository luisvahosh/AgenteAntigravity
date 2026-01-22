from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.api import deps
from app.models.property import Property as PropertyModel
from app.models.client import Client as ClientModel

router = APIRouter()

@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(deps.get_db),
):
    total_properties = db.query(PropertyModel).count()
    properties_sale = db.query(PropertyModel).filter(PropertyModel.type == "sale").count()
    properties_rent = db.query(PropertyModel).filter(PropertyModel.type == "rent").count()
    
    total_clients = db.query(ClientModel).count()
    active_clients = db.query(ClientModel).filter(ClientModel.status == "active").count()
    
    # Calculate simple "Sales" based on 'sold' status (mock logic for now if status isn't fully used)
    # Assuming 'sold' status exists or we just use a placeholder
    sales_count = db.query(PropertyModel).filter(PropertyModel.status == "sold").count()
    rented_count = db.query(PropertyModel).filter(PropertyModel.status == "rented").count()

    return {
        "total_properties": total_properties,
        "properties_for_sale": properties_sale,
        "properties_for_rent": properties_rent,
        "total_clients": total_clients,
        "active_clients": active_clients,
        "sales_count": sales_count,
        "rented_count": rented_count
    }

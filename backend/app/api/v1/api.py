from fastapi import APIRouter
from app.api.v1.endpoints import properties
from app.api.v1.endpoints import clients
from app.api.v1.endpoints import dashboard
from app.api.v1.endpoints import transactions
from app.api.v1.endpoints import tenants
from app.api.v1.endpoints import users

api_router = APIRouter()
api_router.include_router(properties.router, prefix="/properties", tags=["properties"])
api_router.include_router(clients.router, prefix="/clients", tags=["clients"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(transactions.router, prefix="/transactions", tags=["transactions"])
api_router.include_router(tenants.router, prefix="/tenants", tags=["tenants"])
api_router.include_router(users.router, prefix="/users", tags=["users"])

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api import deps
from app.models.client import Client as ClientModel
from app.schemas.client import Client, ClientCreate, ClientUpdate

router = APIRouter()

@router.get("/", response_model=List[Client])
def read_clients(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    clients = db.query(ClientModel).offset(skip).limit(limit).all()
    return clients

@router.post("/", response_model=Client)
def create_client(
    *,
    db: Session = Depends(deps.get_db),
    client_in: ClientCreate,
):
    # Check if string exists
    client = db.query(ClientModel).filter(ClientModel.email == client_in.email).first()
    if client:
        raise HTTPException(status_code=400, detail="El email ya está registrado")
        
    client = ClientModel(
        **client_in.model_dump()
    )
    db.add(client)
    db.commit()
    db.refresh(client)
    return client

@router.get("/{id}", response_model=Client)
def read_client(
    *,
    db: Session = Depends(deps.get_db),
    id: UUID,
):
    client = db.query(ClientModel).filter(ClientModel.id == id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client

@router.put("/{id}", response_model=Client)
def update_client(
    *,
    db: Session = Depends(deps.get_db),
    id: UUID,
    client_in: ClientUpdate,
):
    client = db.query(ClientModel).filter(ClientModel.id == id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    update_data = client_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(client, field, value)
    
    db.add(client)
    db.commit()
    db.refresh(client)
    return client

@router.delete("/{id}", response_model=Client)
def delete_client(
    *,
    db: Session = Depends(deps.get_db),
    id: UUID,
):
    client = db.query(ClientModel).filter(ClientModel.id == id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    db.delete(client)
    db.commit()
    return client

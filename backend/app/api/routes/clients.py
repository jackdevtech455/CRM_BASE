from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.routes.auth import get_current_user
from app.db import get_db
from app.models import Client, User
from app.schemas import ClientCreate, ClientOut

router = APIRouter()


@router.get("", response_model=list[ClientOut])
def list_clients(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    return (
        db.query(Client)
        .filter(Client.owner_id == current_user.id)
        .order_by(Client.created_at.desc())
        .all()
    )


@router.post("", response_model=ClientOut)
def create_client(
    client: ClientCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    db_client = Client(**client.dict(), owner_id=current_user.id)
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client


@router.delete("/{client_id}")
def delete_client(
    client_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    client = (
        db.query(Client).filter(Client.id == client_id, Client.owner_id == current_user.id).first()
    )
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    db.delete(client)
    db.commit()
    return {"message": "Client deleted"}

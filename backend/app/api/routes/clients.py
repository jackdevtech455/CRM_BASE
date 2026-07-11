from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.routes.auth import get_current_user
from app.db import get_db
from app.models import Client, User
from app.schemas.client import ClientCreate, ClientRead, ClientUpdate

router = APIRouter(tags=["clients"])


DatabaseDependency = Annotated[Session, Depends(get_db)]
CurrentUserDependency = Annotated[User, Depends(get_current_user)]


@router.get("", response_model=list[ClientRead])
def get_clients(
    db: DatabaseDependency,
    current_user: CurrentUserDependency,
) -> list[Client]:
    statement = (
        select(Client).where(Client.owner_id == current_user.id).order_by(Client.created_at.desc())
    )

    return list(db.scalars(statement).all())


@router.get("/{client_id}", response_model=ClientRead)
def get_client(
    client_id: int,
    db: DatabaseDependency,
    current_user: CurrentUserDependency,
) -> Client:
    statement = select(Client).where(
        Client.id == client_id,
        Client.owner_id == current_user.id,
    )

    client = db.scalar(statement)

    if client is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found",
        )

    return client


@router.post(
    "",
    response_model=ClientRead,
    status_code=status.HTTP_201_CREATED,
)
def create_client(
    client_data: ClientCreate,
    db: DatabaseDependency,
    current_user: CurrentUserDependency,
) -> Client:
    client = Client(
        **client_data.model_dump(),
        owner_id=current_user.id,
    )

    db.add(client)
    db.commit()
    db.refresh(client)

    return client


@router.patch("/{client_id}", response_model=ClientRead)
def update_client(
    client_id: int,
    client_data: ClientUpdate,
    db: DatabaseDependency,
    current_user: CurrentUserDependency,
) -> Client:
    statement = select(Client).where(
        Client.id == client_id,
        Client.owner_id == current_user.id,
    )

    client = db.scalar(statement)

    if client is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found",
        )

    update_data = client_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(client, field, value)

    db.commit()
    db.refresh(client)

    return client


@router.delete(
    "/{client_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_client(
    client_id: int,
    db: DatabaseDependency,
    current_user: CurrentUserDependency,
) -> Response:
    statement = select(Client).where(
        Client.id == client_id,
        Client.owner_id == current_user.id,
    )

    client = db.scalar(statement)

    if client is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found",
        )

    db.delete(client)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)

"""
Client routes mounted at /api/clients.

GET     /api/clients: Get a list of clients for the current user
GET     /api/clients/{client_id}: Get a specific client by ID for the current user
POST    /api/clients: Create a new client for the current user
PATCH   /api/clients/{client_id}: Update a specific client by ID for the current user
DELETE  /api/clients/{client_id}: Delete a specific client by ID for the current user
"""

from fastapi import APIRouter, HTTPException, Response, status
from sqlalchemy import select

from app.api.types import CurrentUserDependency, DatabaseDependency
from app.models import Client
from app.schemas.client import ClientCreate, ClientRead, ClientUpdate

router = APIRouter(tags=["clients"])


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

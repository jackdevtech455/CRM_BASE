from fastapi import APIRouter, HTTPException, Response, status
from sqlalchemy import select

from app.api.routes._types import CurrentUserDependency, DatabaseDependency
from app.models import Ticket
from app.schemas.ticket import TicketCreate, TicketRead, TicketUpdate

router = APIRouter(tags=["tickets"])


@router.get("", response_model=list[TicketRead])
def get_tickets(
    db: DatabaseDependency,
    current_user: CurrentUserDependency,
) -> list[Ticket]:

    statement = (
        select(Ticket).where(Ticket.owner_id == current_user.id).order_by(Ticket.created_at.desc())
    )

    return list(db.scalars(statement).all())


@router.get("/{ticket_id}", response_model=TicketRead)
def get_ticket(
    ticket_id: int,
    db: DatabaseDependency,
    current_user: CurrentUserDependency,
) -> Ticket:
    statement = select(Ticket).where(
        Ticket.id == ticket_id,
        Ticket.owner_id == current_user.id,
    )

    ticket = db.scalar(statement)

    if ticket is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found",
        )

    return ticket


@router.post(
    "",
    response_model=TicketRead,
    status_code=status.HTTP_201_CREATED,
)
def create_ticket(
    ticket_data: TicketCreate,
    db: DatabaseDependency,
    current_user: CurrentUserDependency,
) -> Ticket:
    ticket = Ticket(
        **ticket_data.model_dump(),
        owner_id=current_user.id,
    )

    db.add(ticket)
    db.commit()
    db.refresh(ticket)

    return ticket


@router.patch("/{ticket_id}", response_model=TicketRead)
def update_ticket(
    ticket_id: int,
    ticket_data: TicketUpdate,
    db: DatabaseDependency,
    current_user: CurrentUserDependency,
) -> Ticket:
    statement = select(Ticket).where(
        Ticket.id == ticket_id,
        Ticket.owner_id == current_user.id,
    )

    ticket = db.scalar(statement)

    if ticket is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found",
        )

    update_data = ticket_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(ticket, field, value)

    db.commit()
    db.refresh(ticket)

    return ticket


@router.delete(
    "/{ticket_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_ticket(
    ticket_id: int,
    db: DatabaseDependency,
    current_user: CurrentUserDependency,
) -> Response:
    statement = select(Ticket).where(
        Ticket.id == ticket_id,
        Ticket.owner_id == current_user.id,
    )

    ticket = db.scalar(statement)

    if ticket is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found",
        )

    db.delete(ticket)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)

from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.routes.auth import get_current_user
from app.db import get_db
from app.models import Ticket, User
from app.schemas import TicketCreate, TicketOut

router = APIRouter()


@router.get("", response_model=list[TicketOut])
def list_tickets(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    return (
        db.query(Ticket)
        .filter(Ticket.owner_id == current_user.id)
        .order_by(Ticket.created_at.desc())
        .all()
    )


@router.post("", response_model=TicketOut)
def create_ticket(
    ticket: TicketCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    db_ticket = Ticket(**ticket.dict(), owner_id=current_user.id)
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

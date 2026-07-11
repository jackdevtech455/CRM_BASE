from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.routes.auth import get_current_user
from app.db import get_db
from app.models import Client, Ticket, User

router = APIRouter()


@router.get("")
def dashboard_stats(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    clients = db.query(Client).filter(Client.owner_id == current_user.id).count()
    tickets = db.query(Ticket).filter(Ticket.owner_id == current_user.id).count()
    open_tickets = (
        db.query(Ticket).filter(Ticket.owner_id == current_user.id, Ticket.status == "Open").count()
    )
    return {
        "clients": clients,
        "tickets": tickets,
        "open_tickets": open_tickets,
    }

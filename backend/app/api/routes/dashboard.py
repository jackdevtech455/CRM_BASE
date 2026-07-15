"""
Dashboard routes mounted at /api/dashboard.

GET     /api/dashboard: Get dashboard stats for the current user
"""

from fastapi import APIRouter

from app.api.types import CurrentUserDependency, DatabaseDependency
from app.models import Client, Ticket

router = APIRouter()


@router.get("")
def dashboard_stats(
    db: DatabaseDependency,
    current_user: CurrentUserDependency,
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

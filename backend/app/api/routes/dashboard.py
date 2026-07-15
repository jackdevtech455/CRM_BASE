"""
Dashboard routes mounted at /api/dashboard.

GET     /api/dashboard: Get dashboard stats for the current user
"""

from fastapi import APIRouter

from app.api.dependencies import CurrentUserDependency
from app.db.dependencies import DatabaseDependency
from app.models.client import Client
from app.models.ticket import Ticket

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

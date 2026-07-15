from fastapi import APIRouter

from app.api.routes import clients, dashboard, tickets

api_router = APIRouter()

api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(clients.router, prefix="/clients", tags=["clients"])
api_router.include_router(tickets.router, prefix="/tickets", tags=["tickets"])

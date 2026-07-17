"""
API routes mounted at /api.
"""

from fastapi import APIRouter

from app.api.routes import clients, dashboard, tickets

api_routers = APIRouter()

api_routers.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_routers.include_router(clients.router, prefix="/clients", tags=["clients"])
api_routers.include_router(tickets.router, prefix="/tickets", tags=["tickets"])

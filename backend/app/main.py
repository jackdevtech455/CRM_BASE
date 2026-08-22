"""
Entrypoint for the application.
Initializes the FastAPI app, sets up middleware, and includes API routes.

/auth/: Routes for user authentication and token management.
/api/dashboard/: Routes for fetching dashboard statistics for the current user.
/api/clients/: Routes for managing clients for the current user.
/api/tickets/: Routes for managing tickets for the current user.
/health: Health check endpoint to verify the application is running.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_routers
from app.api.routes import auth
from app.api.routes.health import health_router

app = FastAPI(
    title="CRM Backend",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["api", "auth"])
app.include_router(api_routers, prefix="/api", tags=["api"])
app.include_router(health_router, prefix="/api", tags=["api"])

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import auth, clients, dashboard, tickets
from app.db import Base, engine

app = FastAPI(
    title="CRM",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)  # TODO use alembic for migrations instead

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(clients.router, prefix="/api/clients", tags=["clients"])
app.include_router(tickets.router, prefix="/api/tickets", tags=["tickets"])


@app.get("/health")
def health():
    return {"status": "ok"}

from typing import TYPE_CHECKING

from fastapi import APIRouter, Depends
from sqlalchemy import text

from app.db.session import get_db

if TYPE_CHECKING:
    from sqlalchemy.orm import Session


health_router = APIRouter()


@health_router.get("/api/health")
def health(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"status": "healthy"}

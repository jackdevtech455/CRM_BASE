"""
Database connection and session management.

Base: The declarative base class for SQLAlchemy models.
get_db: Dependency that provides a database session for each request.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeMeta, declarative_base, sessionmaker

from app.settings import get_settings

settings = get_settings()

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# TODO change to using DeclarativeBase from sqlalchemy.orm
Base: DeclarativeMeta = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

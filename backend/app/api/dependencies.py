"""
Shared dependencies for use in routes.
"""

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.auth.users import get_current_user
from app.db.session import get_db
from app.models.user import User

DatabaseDependency = Annotated[Session, Depends(get_db)]
CurrentUserDependency = Annotated[User, Depends(get_current_user)]

"""
Shared dependencies for use in routes.
"""

# TODO move these dependencies to a central location so they can be reused across the app,
#   not just in routes

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.api.routes.auth import get_current_user
from app.db import get_db
from app.models import User

DatabaseDependency = Annotated[Session, Depends(get_db)]
CurrentUserDependency = Annotated[User, Depends(get_current_user)]

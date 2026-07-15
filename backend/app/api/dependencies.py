"""
Shared dependencies for use in routes.
"""

from typing import Annotated

from fastapi import Depends

from app.auth.users import get_current_user
from app.models.user import User

CurrentUserDependency = Annotated[User, Depends(get_current_user)]

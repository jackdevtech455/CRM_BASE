"""
Shared auth dependencies.
"""

from typing import Annotated

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

AccessTokenDependency = Annotated[str, Depends(oauth2_scheme)]
OAuth2PasswordRequestFormDependency = Annotated[
    OAuth2PasswordRequestForm,
    Depends(OAuth2PasswordRequestForm),
]

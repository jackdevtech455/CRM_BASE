from typing import TYPE_CHECKING, Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.security.passwords import verify_password
from app.core.settings import get_settings
from app.models.user import User
from app.schemas.token import TokenData

if TYPE_CHECKING:
    from app.api.dependencies import DatabaseDependency

settings = get_settings()


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

OAuth2SchemeDependency = Annotated[str, Depends(oauth2_scheme)]
OAuth2PasswordRequestFormDependency = Annotated[OAuth2PasswordRequestForm, Depends()]


def authenticate_user(
    db: Session,
    email: str,
    password: str,
) -> User | None:
    user = db.query(User).filter(User.email == email).first()

    if not user:
        return None

    if not verify_password(password, user.password_hash):
        return None

    return user


def get_current_user(
    token: OAuth2SchemeDependency,
    db: DatabaseDependency,
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.auth.secret_key, algorithms=[settings.auth.algorithm])
        email: str | None = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.email == token_data.email).first()
    if user is None:
        raise credentials_exception

    return user

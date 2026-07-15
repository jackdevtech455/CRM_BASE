from datetime import datetime, timedelta, timezone

from jose import jwt

from app.core.settings import get_settings

settings = get_settings()


def create_access_token(
    data: dict,
    expires_delta: timedelta | None = None,
) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.auth.access_token_expire_minutes,
        )
    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, settings.auth.secret_key, algorithm=settings.auth.algorithm)

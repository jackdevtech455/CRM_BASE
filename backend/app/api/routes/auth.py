"""
Authentication routes mounted at /auth.

POST    /register: Register a new user
POST    /login: Login and get an access token
GET     /me: Get the current logged-in user
"""

from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.api.types import CurrentUserDependency, DatabaseDependency
from app.models import User
from app.schemas.token import Token, TokenData
from app.schemas.user import UserCreate, UserRead

router = APIRouter()

SECRET_KEY = "dev-secret-key-change-me"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 8

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

OAuth2SchemeDependency = Annotated[str, Depends(oauth2_scheme)]
OAuth2PasswordRequestFormDependency = Annotated[OAuth2PasswordRequestForm, Depends()]


def create_access_token(
    data: dict,
    expires_delta: timedelta | None = None,
) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


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
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
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


@router.post("/register", response_model=UserRead)
def register_user(
    user: UserCreate,
    db: DatabaseDependency,
) -> User:
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    print("LOG: ", user.model_dump())
    print("LOG: ", repr(user.password))

    db_user = User(
        name=user.name,
        email=str(user.email),
        password_hash=get_password_hash(user.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestFormDependency,
    db: DatabaseDependency,
) -> dict[str, str]:  # TODO change to Token?
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    access_token = create_access_token(data={"sub": user.email})

    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserRead)
def get_me(
    current_user: CurrentUserDependency,
) -> CurrentUserDependency:  # TODO change to User?
    return current_user

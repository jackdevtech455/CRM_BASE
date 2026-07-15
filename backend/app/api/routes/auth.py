"""
Authentication routes mounted at /auth.

POST    /register: Register a new user
POST    /login: Login and get an access token
GET     /me: Get the current logged-in user
"""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from app.api.dependencies import CurrentUserDependency, DatabaseDependency
from app.auth.users import authenticate_user
from app.core.security.passwords import get_password_hash
from app.core.security.tokens import create_access_token
from app.core.settings import get_settings
from app.models.user import User
from app.schemas.token import Token
from app.schemas.user import UserCreate, UserRead

router = APIRouter()

settings = get_settings()


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

OAuth2SchemeDependency = Annotated[str, Depends(oauth2_scheme)]
OAuth2PasswordRequestFormDependency = Annotated[OAuth2PasswordRequestForm, Depends()]


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

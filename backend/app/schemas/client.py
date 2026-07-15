from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr


class ClientBase(BaseModel):
    name: str
    email: EmailStr
    contact_name: str
    phone: Optional[str] = None
    status: Optional[str] = "Active"


class ClientCreate(ClientBase):
    pass


class ClientRead(ClientBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_id: int
    created_at: datetime


class ClientUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    contact_name: str | None = None
    status: str | None = None
    phone: str | None = None

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class TicketBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[str] = "Open"
    priority: Optional[str] = "Medium"
    client_id: int


class TicketCreate(TicketBase):
    pass


class TicketRead(TicketBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TicketUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: str | None = None
    priority: str | None = None
    client_id: int | None = None

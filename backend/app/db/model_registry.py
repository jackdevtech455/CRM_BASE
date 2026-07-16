from app.db.base import Base
from app.models.client import Client
from app.models.ticket import Ticket
from app.models.user import User

_ = [Client, Ticket, User]

target_metadata = Base.metadata

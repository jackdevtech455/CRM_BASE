"""
Schemas for the Token model.

Token: Schema for the access token.
TokenData: Schema for the data contained in the access token.
"""

from typing import Optional

from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: Optional[str] = None

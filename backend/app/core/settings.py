"""
Application shared settings.

auth.secret_key: Secret key used for signing JWT tokens.
auth.algorithm: Algorithm used for signing JWT tokens.
auth.access_token_expire_minutes: Expiration time for access tokens in minutes.
database.url: Database connection URL.
"""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class AuthSettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_prefix="AUTH_",
    )

    secret_key: str
    algorithm: str
    access_token_expire_minutes: int


class DatabaseSettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_prefix="DATABASE_",
    )

    url: str


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
        frozen=True,
        env_nested_delimiter="__",
    )

    auth: AuthSettings
    database: DatabaseSettings


@lru_cache()
def get_settings() -> Settings:
    return Settings()  # pyright: ignore[reportCallIssue]

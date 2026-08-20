FROM python:3.13-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY --from=ghcr.io/astral-sh/uv:0.9.2 /uv /bin/

COPY /alembic/ /app/alembic/
COPY /app/ /app/app/
COPY /.python-version /app/.python-version
COPY /alembic.ini /app/alembic.ini
COPY /pyproject.toml /app/pyproject.toml

RUN uv sync

EXPOSE 8000

CMD tail -f /dev/null

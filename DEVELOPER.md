# DEVELOPER GUIDE

## /backend

Language: Python

### Backend Technologies

| technology | use |
| ---------- | --- |
| uv | environmenting |
| fastapi | api framework |
| pydantic | api schemas |
| sqlalchemy | db models |
| uvicorn | api hosting |
| psycopg2 | postgres interaction |
| pwdlib[argon2] | hashing |
| jose | jwt |
| black | formatting |
| ruff | formatting |

### Add a backend dependency

Navigate to /backend and run `uv add {dependency}` to install in the host venv '.venv'. 'pyproject.toml' is bind mounted into the backend container. `sudo docker compose exec backend uv sync` can be run to update the container environment without the need to rebuild. `uv sync` is run inside the backend container on build.

### Update db structure

Navigate to project root and run `sudo docker compose exec backend uv run alembic revision --autogenerate -m "{commit message}"` to generate a revision on in backend container. The /backend/alembic/versions directory is bind mounted, so the generated revision will then be available on the host to check and finalise. Then run `sudo docker compose exec backend uv run alembic upgrade head` to upgrade the db structure.

## /frontend

Language: ReactJS

### Frontend Tehchnologies

| technology | use |
| ---------- | --- |
| pnpm | environmenting |

### Add a frontend dependency

[test this]
Navigate to /frontend and run `pnpm add {dependency}` to isntall in the host '.pnpm-store' and 'node_modules'. 'papckage.json' is bind mounted into the frontend container. `sudo docker compose exec frontend pnpm add {dependency}` can be run to update the container environment without the need to rebuild. `pnpm install` is run inside the frontend container on build.

[old]
Update inside the container which will update the 'package.json' and 'pnpm-lock.yaml' on the host too as they are bind mounted in the compose file.
Navigate to project root and run `sudo docker compose exec frontend pnpm add {dependency}` to install inside the container, then navigate to /frontend and run `pnpm install --frozen-lockfile` to install in the host environment.

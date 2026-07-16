# DEVELOPER GUIDE

## /backend

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
| black | formatting |
| ruff | formatting |

### Add a backend dependency

Navigate to /backend and run `uv add {dependency}` to install in the host .venv. This is recreated inside the container at build.

## /frontend

### Frontend Tehchnologies

| technology | use |
| ---------- | --- |
| pnpm | environmenting |

### Add a frontend dependency

Update inside the container which will update the 'package.json' and 'pnpm-lack.yaml' on the host too as they are bind mounted in the compose file.
Navigate to project root and run `sudo docker compose exec frontend pnpm add {dependency}` to install inside the container, then navigate to /frontend and run `pnpm install --frozen-lockfile` to install in the host environment.

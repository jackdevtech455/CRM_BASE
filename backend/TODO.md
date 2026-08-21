# TODO

- [X] abstract route types to a central shared types file
- [X] abstract helper functions out of routes:
  - [X] auth.py
- [X] change SQLA declarative_base() to DeclarativeBase
- [X] setup and use alembic instead of Base.metadata.create_all in main.py
- [X] fix return types auth.py:
  - [X] /login return Token
  - [X] /me return User
- [X] move api routes from main out into /api/router.py
- [X] update docs with install instructions from host>container and container>host
- [ ] add files to dockerignore and swap to using a bind mount instead of COPY
- [ ] get hot reloading working

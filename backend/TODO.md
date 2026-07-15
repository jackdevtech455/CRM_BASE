# TODO

[X] abstract route types to a central shared types file
[X] abstract helper functions out of routes:
    [X] auth.py
[X] change SQLA declarative_base() to DeclarativeBase
[ ] setup and use alembic instead of Base.metadata.create_all(bind=engine) in main.py
[X] fix return types auth.py:
    [X] /login return Token
    [X] /me return User
[X] move routes from main out into /api/router.py

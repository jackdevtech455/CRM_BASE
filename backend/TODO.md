# TODO

[X] abstract route types to a central shared types file
[X] abstract helper functions out of routes:
    [X] auth.py
[ ] change SQLA declarative_base() to DeclarativeBase
[ ] setup and use alembic instead of Base.metadata.create_all(bind=engine) in main.py
[ ] fix return types auth.py:
    [ ] /login return Token
    [ ] /me return User
[X] move routes from main out into /api/router.py

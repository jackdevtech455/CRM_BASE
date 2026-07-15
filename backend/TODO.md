# TODO

[X] abstract route types to a central shared types file
[X] abstract helper functions out of routes:
    [X] auth.py
[ ] change SQLA declarative_base() to DeclarativeBase
[ ] setup and use alembic instead of Base.metadata.create_all(bind=engine) in main.py
[ ] fix return types auth.py:
    [ ] /login return Token
    [ ] /me return User
[ ] move routes from main out into /api/router.py so main app.include_router has prefix /api and /api/router.py routes have the next prefixes i.e. /auth /clients etc.
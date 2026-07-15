# TODO

[X] abstract route types to a central shared types file
[ ] abstract helper functions out of routes:
    [ ] auth.py
[ ] change SQLA declarative_base() to DeclarativeBase
[ ] setup and use alembic instead of Base.metadata.create_all(bind=engine) in main.py
[ ] fix return types auth.py:
    [ ] /login return Token
    [ ] /me return User

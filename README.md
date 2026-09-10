# CRM Base

CRM Base is a simple, unstyled CRM template designed to be forked and adapted into a larger application. It provides a modern, container-first foundation without adding unnecessary abstractions.

## Features

- Account registration, login and protected routes
- JWT-based authentication with session restoration
- Client and ticket CRUD examples
- Dashboard summary statistics
- PostgreSQL database managed with Alembic migrations
- Health checks for deployment workflows
- Docker Compose environments for development, staging and production
- CI/CD builds and publishes immutable backend and frontend images to GHCR

## Stack

**Backend:** FastAPI, SQLAlchemy 2, PostgreSQL, Pydantic, Alembic and uv  
**Frontend:** React 19, TypeScript, Vite, React Router, TanStack Query and Tailwind CSS  
**Infrastructure:** Docker Compose, GitHub Actions and GHCR

## Project structure

```text
backend/     FastAPI application, models, API routes and migrations
frontend/    React application and API client
```

## Getting started

1. Clone the repository.
2. Create the required environment files from the supplied examples.
3. Start the development Compose configuration.
4. Apply the database migrations with `alembic upgrade head`.
5. Open the frontend and register an account.

The Compose configuration is split into a shared base file and environment-specific overrides. Specify both files when running Compose; the base file is not intended to run by itself.

## Project goals

This project prioritises code that is simple, idiomatic, strongly typed and easy to extend. Styling is deliberately minimal so forks can introduce their own design system.

## Status

The core authentication, client, ticket and dashboard flows are working. The project is currently being refined with improved testing, error handling, security checks and production hardening.

changeme
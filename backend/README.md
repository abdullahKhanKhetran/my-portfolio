# Portfolio Backend

FastAPI backend for the portfolio site, content APIs, and the future AI chat bot.

## What lives here

- API routes for health, profile, knowledge, projects, skills, testimonials, contact messages, and chat
- SQLAlchemy ORM models for structured app data
- Alembic migrations for schema changes
- `knowledge/` markdown files for your personal profile, resume, and project writeups

## Recommended stack

For this portfolio, the best default is:

- PostgreSQL as the main database
- Supabase as the managed Postgres host if you want the easiest deployment path
- Cloudinary for images and media
- Gemini 2.5 Flash for the chat assistant
- Markdown files in `knowledge/` for long-form bio, resume, and chatbot source material

That gives you one clean source of truth for structured records and a separate source of truth for human-authored content.

## Why I recommend PostgreSQL here

Your app data is already structured:

- projects
- skills
- testimonials
- contact messages
- chatbot knowledge metadata

That maps naturally to relational tables and is easy to query with SQLAlchemy. A JSON file in git is fine as seed data or backup content, but it is not ideal as the primary production store. MongoDB can work too, but it is less compelling when your data is already tabular and you may want joins, filters, admin tools, and migrations later.

## Stateless deployment

This backend is set up to stay stateless on Vercel:

- no local database file in production
- no filesystem writes at runtime
- state is stored in external services like Supabase Postgres and Cloudinary
- knowledge is read from markdown files only
- Gemini requests are stateless and sent with `store: false`

If `VERCEL=1` or `ENVIRONMENT=production` is set, the app requires `DATABASE_URL` or `SUPABASE_DB_URL` and will refuse to start without one.

## Database and migrations

This backend uses SQLAlchemy ORM plus Alembic.

Common commands:

```bash
alembic upgrade head
alembic revision -m "add something"
```

If you use Supabase, point the backend at the Postgres connection string from the project dashboard. For serverless-style deployments, the transaction pooler is the safer option.

## Gemini chat

The chat endpoint now uses the Gemini Interactions API with `gemini-2.5-flash`.

Environment variables:

- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `GEMINI_BASE_URL`

The backend keeps a compatibility fallback for the older `LLM_API_KEY` / `LLM_MODEL` / `LLM_BASE_URL` names during transition.

## Environment variables

Set these in `backend/.env`:

- `DATABASE_URL`
- `SUPABASE_DB_URL`
- `SUPABASE_DB_HOST`
- `SUPABASE_DB_PORT`
- `SUPABASE_DB_NAME`
- `SUPABASE_DB_USER`
- `SUPABASE_DB_PASSWORD`
- `SUPABASE_DB_SSLMODE`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `GEMINI_BASE_URL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_URL`
- `CLOUDINARY_UPLOAD_PRESET`
- `CLOUDINARY_FOLDER`

`DATABASE_URL` wins if it is set. If not, the backend will build a Supabase/Postgres URL from the `SUPABASE_DB_*` values. If neither is available, it falls back to a local SQLite file for development only.

## Local development

1. Create a virtual environment.
2. Install dependencies from `requirements.txt`.
3. Run migrations with Alembic.
4. Start the app with Uvicorn.

Example:

```bash
uvicorn app.main:app --reload --port 8000
```

## API routes

- `GET /api/v1/health`
- `GET /api/v1/knowledge`
- `GET /api/v1/projects`
- `GET /api/v1/skills`
- `GET /api/v1/testimonials`
- `POST /api/v1/contact/messages`
- `POST /api/v1/chat`

## Notes for the chatbot

Keep the markdown files short, factual, and easy to chunk. When you add a project, prefer one file per project so retrieval stays clean.

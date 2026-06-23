from __future__ import annotations

from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool

from ..core.config import get_settings

settings = get_settings()
resolved_database_url = settings.resolve_database_url()


def _build_engine(url: str):
    engine_kwargs: dict[str, object] = {"pool_pre_ping": True}
    if url.startswith("sqlite"):
        engine_kwargs["connect_args"] = {"check_same_thread": False}
    else:
        engine_kwargs["poolclass"] = NullPool
    return create_engine(url, **engine_kwargs)


engine = _build_engine(resolved_database_url)

if not resolved_database_url.startswith("sqlite"):
    try:
        with engine.connect():
            pass
    except OperationalError:
        if settings.environment.lower() == "production" or Path.cwd().as_posix().startswith("/vercel"):
            raise
        fallback_url = f"sqlite:///{(Path(__file__).resolve().parents[2] / 'portfolio.db').resolve().as_posix()}"
        engine = _build_engine(fallback_url)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, expire_on_commit=False)

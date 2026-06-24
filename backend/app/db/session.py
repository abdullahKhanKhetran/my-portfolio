from __future__ import annotations

from sqlalchemy import create_engine
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

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, expire_on_commit=False)


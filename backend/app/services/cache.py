from __future__ import annotations

from redis.asyncio import Redis

from ..core.config import get_settings

settings = get_settings()
redis_client = Redis.from_url(settings.redis_url, encoding=None, decode_responses=False) if settings.redis_url else None

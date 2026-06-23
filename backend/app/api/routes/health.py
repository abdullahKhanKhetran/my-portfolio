from __future__ import annotations

from fastapi import APIRouter

from ...services.cache import redis_client

router = APIRouter(tags=["health"])


@router.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/health/media")
async def media_health() -> dict[str, str]:
    if not redis_client:
        return {"status": "ok", "cache": "disabled"}

    try:
        await redis_client.ping()
        return {"status": "ok", "cache": "available"}
    except Exception:
        return {"status": "degraded", "cache": "unavailable"}
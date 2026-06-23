from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from ...core.config import get_settings
from ...services.cache import redis_client
from ...services.media import build_image_response, fetch_cached_image

router = APIRouter(prefix="/media", tags=["media"])


@router.get("/proxy")
async def proxy_image(url: str = Query(..., min_length=8)):
    settings = get_settings()
    try:
        image = await fetch_cached_image(url, settings, redis_client)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    return build_image_response(image)

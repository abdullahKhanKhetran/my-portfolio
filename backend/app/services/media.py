from __future__ import annotations

import hashlib
import logging
from dataclasses import dataclass
from io import BytesIO
from urllib.parse import urlparse

import httpx
from fastapi import HTTPException
from fastapi.responses import StreamingResponse

from ..core.config import Settings

logger = logging.getLogger(__name__)

_ALLOWED_HOSTS = {
    "res.cloudinary.com",
    "images.unsplash.com",
}


@dataclass(frozen=True)
class CachedImage:
    content: bytes
    content_type: str
    cache_hit: bool


def _cache_key(url: str) -> str:
    return f"image:{hashlib.sha256(url.encode('utf-8')).hexdigest()}"


def _is_allowed(url: str) -> bool:
    parsed = urlparse(url)
    return parsed.scheme in {"http", "https"} and parsed.hostname in _ALLOWED_HOSTS


async def fetch_cached_image(url: str, settings: Settings, redis_client) -> CachedImage:
    if not _is_allowed(url):
        raise HTTPException(status_code=400, detail="Image host is not allowed")

    key = _cache_key(url)
    cached = {}
    if redis_client:
        try:
            cached = await redis_client.hgetall(key)
        except Exception as exc:
            logger.warning("Failed to read image cache for %s: %s", url, exc)
            cached = {}

    if cached:
        content = cached.get(b"content")
        content_type = cached.get(b"content_type", b"image/jpeg").decode("utf-8")
        if content:
            return CachedImage(content=content, content_type=content_type, cache_hit=True)

    timeout = httpx.Timeout(connect=5.0, read=15.0, write=5.0, pool=5.0)
    try:
        async with httpx.AsyncClient(timeout=timeout, follow_redirects=True) as client:
            response = await client.get(url)
    except httpx.HTTPError as exc:
        logger.warning("Image fetch failed for %s: %s", url, exc)
        raise HTTPException(status_code=502, detail="Failed to fetch image") from exc

    if response.status_code >= 400:
        logger.warning("Image fetch returned %s for %s", response.status_code, url)
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch image")

    content_type = response.headers.get("content-type", "image/jpeg")
    content = response.content

    if redis_client:
        try:
            await redis_client.hset(key, mapping={"content": content, "content_type": content_type})
            await redis_client.expire(key, settings.image_cache_ttl_seconds)
        except Exception as exc:
            logger.warning("Failed to cache image %s: %s", url, exc)

    return CachedImage(content=content, content_type=content_type, cache_hit=False)


def build_image_response(image: CachedImage) -> StreamingResponse:
    response = StreamingResponse(BytesIO(image.content), media_type=image.content_type)
    response.headers["X-Image-Cache"] = "HIT" if image.cache_hit else "MISS"
    response.headers["Cache-Control"] = "public, max-age=31536000, immutable"
    return response

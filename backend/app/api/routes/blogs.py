from __future__ import annotations

import json
from pathlib import Path

from fastapi import APIRouter, HTTPException

from ...core.config import get_settings
from ...services.knowledge import read_text_file

router = APIRouter(prefix="/blogs", tags=["blogs"])


def _load_blog_index() -> list[dict[str, object]]:
    settings = get_settings()
    index_path = settings.knowledge_dir / "portfolio_seed.json"
    if not index_path.exists():
        return []

    with index_path.open(encoding="utf-8") as handle:
        data = json.load(handle)

    return list(data.get("blogs") or [])


def _read_blog_content(path: str) -> str:
    settings = get_settings()
    target = settings.knowledge_dir / path
    if not target.exists():
        raise HTTPException(status_code=404, detail="Blog post not found")
    return read_text_file(target)


@router.get("")
def list_blogs() -> list[dict[str, object]]:
    return [
        {
            **post,
            "content": _read_blog_content(str(post["content_path"])),
        }
        for post in _load_blog_index()
    ]


@router.get("/{slug}")
def get_blog(slug: str) -> dict[str, object]:
    for post in _load_blog_index():
        if post["slug"] == slug:
            return {**post, "content": _read_blog_content(str(post["content_path"]))}
    raise HTTPException(status_code=404, detail="Blog post not found")

from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, HTTPException

from ...core.config import get_settings
from ...services.knowledge import read_text_file

router = APIRouter(prefix="/blogs", tags=["blogs"])

BLOGS = [
    {
        "slug": "testing-claude-fable-5-on-a-real-project",
        "title": "Testing Claude Fable 5 on a Real Project: ARIC",
        "excerpt": "Benchmarks and greenfield demos measure raw generation. I wanted to know how Fable 5 behaves when dropped into an existing codebase with real constraints — so I let it loose on ARIC, my MCP-based agent project.",
        "date": "2026-06-12",
        "display_date": "June 12, 2026",
        "read_time": "7 min read",
        "tags": ["AI", "Claude", "Agents", "MCP", "Dev Tools"],
        "cover": "/blogs/Testing%20fable%205/OIF.webp",
        "path": "blogs/testing-claude-fable-5.md",
    }
]


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
            "content": _read_blog_content(post["path"]),
        }
        for post in BLOGS
    ]


@router.get("/{slug}")
def get_blog(slug: str) -> dict[str, object]:
    for post in BLOGS:
        if post["slug"] == slug:
            return {**post, "content": _read_blog_content(post["path"])}
    raise HTTPException(status_code=404, detail="Blog post not found")

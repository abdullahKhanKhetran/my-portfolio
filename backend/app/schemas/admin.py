from __future__ import annotations

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ProjectCreate(BaseModel):
    slug: str
    title: str
    summary: str
    role: str
    stack: list[str] = Field(default_factory=list)
    live_url: str | None = None
    repo_url: str | None = None
    cover_image_url: str | None = None
    featured: bool = False
    sort_order: int = 0


class ProjectUpdate(BaseModel):
    slug: str | None = None
    title: str | None = None
    summary: str | None = None
    role: str | None = None
    stack: list[str] | None = None
    live_url: str | None = None
    repo_url: str | None = None
    cover_image_url: str | None = None
    featured: bool | None = None
    sort_order: int | None = None


class SkillCreate(BaseModel):
    category: str
    name: str
    proficiency: int | None = None
    sort_order: int = 0


class SkillUpdate(BaseModel):
    category: str | None = None
    name: str | None = None
    proficiency: int | None = None
    sort_order: int | None = None


class TestimonialCreate(BaseModel):
    author_name: str
    author_role: str | None = None
    company: str | None = None
    quote: str
    avatar_url: str | None = None
    sort_order: int = 0


class TestimonialUpdate(BaseModel):
    author_name: str | None = None
    author_role: str | None = None
    company: str | None = None
    quote: str | None = None
    avatar_url: str | None = None
    sort_order: int | None = None


class ContactMessageUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    subject: str | None = None
    message: str | None = None
    status: str | None = None


class KnowledgeUpdate(BaseModel):
    content: str


class KnowledgeFileRead(BaseModel):
    path: str
    content: str


class AdminAuthRequest(BaseModel):
    token: str


class AdminAuthResponse(BaseModel):
    ok: bool


class AdminAuthState(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    ok: bool

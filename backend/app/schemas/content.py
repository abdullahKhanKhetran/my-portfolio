from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr


class ProjectRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    title: str
    summary: str
    role: str
    stack: list[str]
    live_url: str | None = None
    repo_url: str | None = None
    cover_image_url: str | None = None
    featured: bool
    sort_order: int
    created_at: datetime
    updated_at: datetime | None = None


class SkillRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    category: str
    name: str
    proficiency: int | None = None
    sort_order: int


class TestimonialRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    author_name: str
    author_role: str | None = None
    company: str | None = None
    quote: str
    avatar_url: str | None = None
    sort_order: int


class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


class ContactMessageRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: EmailStr
    subject: str
    message: str
    status: str
    created_at: datetime
    updated_at: datetime | None = None

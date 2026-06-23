from __future__ import annotations

from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: str = Field(pattern="^(system|user|assistant)$")
    content: str


class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = Field(default_factory=list)
    previous_interaction_id: str | None = None
    temperature: float = 0.2


class ChatResponse(BaseModel):
    answer: str
    used_llm: bool
    model: str | None = None
    sources: list[str] = Field(default_factory=list)
    interaction_id: str | None = None

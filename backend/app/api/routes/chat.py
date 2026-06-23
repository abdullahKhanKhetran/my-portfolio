from __future__ import annotations

from fastapi import APIRouter, HTTPException

from ...core.config import get_settings
from ...schemas.chat import ChatRequest, ChatResponse
from ...services.chatbot import ask_gemini, build_fallback_answer, build_search_text, build_system_prompt, load_chat_context

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    settings = get_settings()
    context = load_chat_context(settings)
    history = [message.model_dump() for message in request.history]
    search_text = build_search_text(history, request.message)
    system_prompt, source_names, relevant_text = build_system_prompt(context, search_text, history)

    if settings.resolved_gemini_api_key:
        try:
            result = await ask_gemini(
                settings,
                system_prompt,
                history,
                request.message,
                request.temperature,
                previous_interaction_id=request.previous_interaction_id,
            )
            return ChatResponse(
                answer=result.answer,
                used_llm=True,
                model=settings.resolved_gemini_model,
                sources=source_names,
                interaction_id=result.interaction_id,
            )
        except Exception as exc:
            raise HTTPException(status_code=502, detail=str(exc)) from exc

    return ChatResponse(
        answer=build_fallback_answer(request.message, relevant_text),
        used_llm=False,
        model=None,
        sources=source_names,
        interaction_id=None,
    )

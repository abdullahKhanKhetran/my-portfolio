from __future__ import annotations

import asyncio
import json
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect

from ...core.config import get_settings
from ...schemas.chat import ChatRequest, ChatResponse
from ...services.chatbot import ask_gemini, build_fallback_answer, build_search_text, build_system_prompt, load_chat_context, trim_current_question

router = APIRouter(prefix="/chat", tags=["chat"])


def _chunk_text(text: str, size: int = 18) -> list[str]:
    chunks: list[str] = []
    for i in range(0, len(text), size):
        chunks.append(text[i : i + size])
    return chunks or [text]


async def _build_chat_response(request: ChatRequest) -> tuple[ChatResponse, list[str]]:
    settings = get_settings()
    context = load_chat_context(settings)
    history = [message.model_dump() for message in request.history]
    conversation_history = trim_current_question(history, request.message)
    search_text = build_search_text(conversation_history, request.message)
    system_prompt, source_names, relevant_text = build_system_prompt(context, search_text, conversation_history)

    if settings.resolved_gemini_api_key:
        try:
            result = await ask_gemini(
                settings,
                system_prompt,
                conversation_history,
                request.message,
                request.temperature,
                previous_interaction_id=request.previous_interaction_id,
            )
            return (
                ChatResponse(
                    answer=result.answer,
                    used_llm=True,
                    model=settings.resolved_gemini_model,
                    sources=source_names,
                    interaction_id=result.interaction_id,
                ),
                source_names,
            )
        except Exception as exc:
            raise HTTPException(status_code=502, detail=str(exc)) from exc

    return (
        ChatResponse(
            answer=build_fallback_answer(request.message, relevant_text),
            used_llm=False,
            model=None,
            sources=source_names,
            interaction_id=None,
        ),
        source_names,
    )


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    response, _ = await _build_chat_response(request)
    return response


@router.websocket("/ws")
async def chat_stream(websocket: WebSocket) -> None:
    await websocket.accept()
    previous_interaction_id: str | None = None

    try:
        while True:
            raw = await websocket.receive_text()
            try:
                payload = json.loads(raw)
                request = ChatRequest(**payload)
            except Exception:
                await websocket.send_json({"type": "error", "message": "Invalid chat payload."})
                continue

            if request.previous_interaction_id:
                previous_interaction_id = request.previous_interaction_id

            settings = get_settings()
            context = load_chat_context(settings)
            history = [message.model_dump() for message in request.history]
            conversation_history = trim_current_question(history, request.message)
            search_text = build_search_text(conversation_history, request.message)
            system_prompt, source_names, relevant_text = build_system_prompt(context, search_text, conversation_history)

            await websocket.send_json({"type": "start", "sources": source_names})

            if settings.resolved_gemini_api_key:
                try:
                    result = await ask_gemini(
                        settings,
                        system_prompt,
                        conversation_history,
                        request.message,
                        request.temperature,
                        previous_interaction_id=previous_interaction_id,
                    )
                    answer = result.answer
                    previous_interaction_id = result.interaction_id or previous_interaction_id
                except Exception:
                    answer = build_fallback_answer(request.message, relevant_text)
                    previous_interaction_id = None
            else:
                answer = build_fallback_answer(request.message, relevant_text)
                previous_interaction_id = None

            emitted = ""
            for chunk in _chunk_text(answer):
                emitted += chunk
                await websocket.send_json({"type": "delta", "text": chunk})
                await asyncio.sleep(0.01)

            await websocket.send_json(
                {
                    "type": "done",
                    "answer": emitted,
                    "sources": source_names,
                    "interaction_id": previous_interaction_id,
                }
            )
    except WebSocketDisconnect:
        return

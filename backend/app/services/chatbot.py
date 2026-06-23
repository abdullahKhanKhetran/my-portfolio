from __future__ import annotations

import re
from collections import Counter
from dataclasses import dataclass

import httpx

from ..core.config import Settings
from .knowledge import list_knowledge_files, read_text_file

_WORD_RE = re.compile(r"[a-z0-9']+")
_CHUNK_SPLIT_RE = re.compile(r"\n\s*\n")
_RECENT_TURNS = 6


@dataclass(frozen=True)
class KnowledgeChunk:
    source: str
    text: str


@dataclass(frozen=True)
class ChatContext:
    chunks: list[KnowledgeChunk]
    source_files: list[str]


@dataclass(frozen=True)
class GeminiResult:
    answer: str
    interaction_id: str | None


def _tokenize(text: str) -> Counter[str]:
    return Counter(token for token in _WORD_RE.findall(text.lower()) if len(token) > 2)


def _chunk_text(source: str, text: str) -> list[KnowledgeChunk]:
    chunks: list[KnowledgeChunk] = []
    for part in _CHUNK_SPLIT_RE.split(text.strip()):
        cleaned = part.strip()
        if cleaned:
            chunks.append(KnowledgeChunk(source=source, text=cleaned))
    return chunks


def load_chat_context(settings: Settings) -> ChatContext:
    files = sorted(list_knowledge_files(settings.knowledge_dir))
    chunks: list[KnowledgeChunk] = []

    for relative_path in files:
        if not relative_path.lower().endswith('.md'):
            continue
        content = read_text_file(settings.knowledge_dir / relative_path)
        if not content:
            continue
        chunks.extend(_chunk_text(relative_path, content))

    return ChatContext(chunks=chunks, source_files=files)


def build_search_text(history: list[dict[str, str]], question: str) -> str:
    recent_messages = history[-_RECENT_TURNS:]
    recent_text = " ".join(message.get('content', '') for message in recent_messages if message.get('content'))
    return f"{recent_text} {question}".strip()


def select_relevant_chunks(question: str, context: ChatContext, limit: int = 5) -> list[KnowledgeChunk]:
    question_tokens = _tokenize(question)
    scored: list[tuple[int, int, KnowledgeChunk]] = []

    for index, chunk in enumerate(context.chunks):
        chunk_tokens = _tokenize(chunk.text)
        score = sum(min(question_tokens[token], chunk_tokens[token]) for token in question_tokens)
        if score > 0:
            scored.append((score, index, chunk))

    if not scored:
        return context.chunks[:limit]

    scored.sort(key=lambda item: (-item[0], item[1]))
    selected: list[KnowledgeChunk] = []
    for _, _, chunk in scored:
        selected.append(chunk)
        if len(selected) >= limit:
            break

    return selected or context.chunks[:limit]


def build_system_prompt(context: ChatContext, search_text: str, history: list[dict[str, str]]) -> tuple[str, list[str], str]:
    relevant_chunks = select_relevant_chunks(search_text, context)
    source_names = list(dict.fromkeys(chunk.source for chunk in relevant_chunks))
    relevant_text = "\n\n".join(f"[{chunk.source}]\n{chunk.text}" for chunk in relevant_chunks)
    recent_history = []
    for message in history[-_RECENT_TURNS:]:
        role = message.get('role', 'user')
        content = message.get('content', '').strip()
        if content:
            recent_history.append(f"{role}: {content}")

    system_prompt = (
        'You are a concise, helpful portfolio assistant for Muhammad Abdullah Khan. '
        'Answer using only the supplied knowledge base when possible. '
        'If the user asks about skills, projects, experience, or contact details, prefer concrete facts from the knowledge files. '
        'Use the recent conversation context to stay on topic and maintain continuity across follow-up questions. '
        'If you are unsure, say that you are not certain instead of guessing. '
        'Keep answers brief, natural, and human.'
    )

    context_prompt = (
        f"Knowledge files available: {', '.join(context.source_files)}\n\n"
        f"Recent conversation context:\n{chr(10).join(recent_history) if recent_history else 'No prior conversation.'}\n\n"
        f"Relevant knowledge excerpts:\n{relevant_text}"
    )

    return f"{system_prompt}\n\n{context_prompt}", source_names, relevant_text


def build_fallback_answer(question: str, context_text: str) -> str:
    return (
        'I do not have Gemini configured yet, but here is the most relevant portfolio context I found:\n\n'
        f"{context_text}\n\n"
        f"Question: {question}"
    )


def build_gemini_input(history: list[dict[str, str]], question: str) -> list[dict[str, object]]:
    input_turns: list[dict[str, object]] = []

    for message in history[-_RECENT_TURNS:]:
        role = message.get('role')
        content = message.get('content', '').strip()
        if not content:
            continue

        if role == 'user':
            input_turns.append({
                'type': 'user_input',
                'content': [{'type': 'text', 'text': content}],
            })
        elif role == 'assistant':
            input_turns.append({
                'type': 'model_output',
                'content': [{'type': 'text', 'text': content}],
            })

    input_turns.append({
        'type': 'user_input',
        'content': [{'type': 'text', 'text': question}],
    })
    return input_turns


def extract_gemini_text(payload: dict) -> tuple[str, str | None]:
    interaction_id = payload.get('id')
    for step in reversed(payload.get('steps') or []):
        if step.get('type') != 'model_output':
            continue
        for block in step.get('content') or []:
            if block.get('type') == 'text' and block.get('text'):
                return str(block['text']).strip(), interaction_id
    raise RuntimeError('Gemini response did not include text output')


async def ask_gemini(
    settings: Settings,
    system_instruction: str,
    history: list[dict[str, str]],
    question: str,
    temperature: float,
    previous_interaction_id: str | None = None,
) -> GeminiResult:
    api_key = settings.resolved_gemini_api_key
    if not api_key:
        raise RuntimeError('GEMINI_API_KEY is not configured')

    endpoint = f"{settings.resolved_gemini_base_url.rstrip('/')}/interactions"
    payload: dict[str, object] = {
        'model': settings.resolved_gemini_model,
        'store': False,
        'system_instruction': system_instruction,
        'input': build_gemini_input(history, question),
        'generation_config': {
            'temperature': temperature,
        },
    }
    if previous_interaction_id:
        payload['previous_interaction_id'] = previous_interaction_id

    headers = {
        'x-goog-api-key': api_key,
        'Content-Type': 'application/json',
    }

    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.post(endpoint, headers=headers, json=payload)

    if response.status_code >= 400:
        raise RuntimeError(f'Gemini request failed: {response.text[:500]}')

    answer, interaction_id = extract_gemini_text(response.json())
    return GeminiResult(answer=answer, interaction_id=interaction_id)

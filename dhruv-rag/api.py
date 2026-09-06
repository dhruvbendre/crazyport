"""
Mnemora · the archive as an HTTP API.

The portfolio's Mnemora page talks to this instead of the Streamlit app, so a
visitor can chat with the archive without leaving the solar system. It wraps
the same `Archive` as app.py; nothing about retrieval or the archive's voice
lives here.

    uvicorn api:app --port 8000 --reload

Routes
    GET  /health         what the archive holds and which model answers
    POST /ask            {"question": str, "history": [{"role", "content"}]}
                         -> text/event-stream of JSON events:
                            {"type": "meta", "grounded", "mode", "sources"}
                            {"type": "delta", "text"}            (0..n)
                            {"type": "done", "text"}             (the full answer)
                            {"type": "error", "text"}

Origins allowed to call it come from ARCHIVE_ALLOWED_ORIGINS (comma separated;
"*" for anything). The Vite dev server proxies /api/archive here, so local
development needs no CORS at all.
"""
from __future__ import annotations

import json
import os
from dataclasses import asdict
from typing import Iterator

from starlette.applications import Starlette
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, StreamingResponse
from starlette.routing import Route

from config.settings import load_settings
from rag.llm import ProviderError
from rag.pipeline import Answer, Archive

settings = load_settings()
_archive: Archive | None = None

MAX_QUESTION_CHARS = 600
MAX_HISTORY = 12


def archive() -> Archive:
    global _archive
    if _archive is None:
        _archive = Archive(settings)
    return _archive


def _event(payload: dict) -> str:
    return f"data: {json.dumps(payload, ensure_ascii=False)}\n\n"


def _clean_history(raw: object) -> list[dict[str, str]]:
    if not isinstance(raw, list):
        return []
    history: list[dict[str, str]] = []
    for item in raw[-MAX_HISTORY:]:
        if not isinstance(item, dict):
            continue
        role = item.get("role")
        content = item.get("content")
        if role in {"user", "assistant"} and isinstance(content, str) and content.strip():
            history.append({"role": role, "content": content.strip()[:4000]})
    return history


def _stream(answer: Answer) -> Iterator[str]:
    yield _event({"type": "meta", "grounded": answer.grounded, "mode": answer.mode, "sources": [asdict(s) for s in answer.sources]})
    text = ""
    if answer.stream is not None:
        try:
            for fragment in answer.stream:
                text += fragment
                yield _event({"type": "delta", "text": fragment})
        except ProviderError as exc:
            text = text or str(exc)
            yield _event({"type": "error", "text": str(exc)})
    else:
        text = answer.text
        yield _event({"type": "delta", "text": text})
    yield _event({"type": "done", "text": text})


async def health(_: Request) -> JSONResponse:
    status = archive().status
    return JSONResponse(
        {
            "name": settings.archive_name,
            "owner": settings.owner_name,
            "documents": status.live_documents,
            "chunks": status.chunks,
            "llm": status.llm,
            "generates": status.generates,
            "empty": status.empty,
        }
    )


async def ask(request: Request) -> StreamingResponse | JSONResponse:
    try:
        body = await request.json()
    except Exception:
        return JSONResponse({"error": "Send JSON with a question."}, status_code=400)
    question = body.get("question") if isinstance(body, dict) else None
    if not isinstance(question, str) or not question.strip():
        return JSONResponse({"error": "Ask something."}, status_code=400)
    question = question.strip()[:MAX_QUESTION_CHARS]
    history = _clean_history(body.get("history"))
    answer = archive().ask(question, history)
    return StreamingResponse(
        _stream(answer),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


def _origins() -> list[str]:
    raw = os.environ.get("ARCHIVE_ALLOWED_ORIGINS", "").strip()
    if not raw:
        return ["http://localhost:5173", "http://127.0.0.1:5173"]
    return [o.strip() for o in raw.split(",") if o.strip()]


app = Starlette(
    routes=[Route("/health", health), Route("/ask", ask, methods=["POST"])],
    middleware=[Middleware(CORSMiddleware, allow_origins=_origins(), allow_methods=["GET", "POST"], allow_headers=["Content-Type"])],
)

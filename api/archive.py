"""
Mnemora's archive API as a Vercel Python function.

The same Starlette app that `uvicorn api:app` serves locally (dhruv-rag/api.py),
mounted so that both `/api/archive/ask` (the path the portfolio calls) and a
bare `/ask` (if the platform strips the prefix) reach it. The index is built
from dhruv-rag/knowledge on the first request and cached in /tmp, the only
writable directory on the platform.
"""
from __future__ import annotations

import importlib.util
import os
import sys
from pathlib import Path

ARCHIVE_ROOT = Path(__file__).resolve().parent.parent / "dhruv-rag"
sys.path.insert(0, str(ARCHIVE_ROOT))
os.environ.setdefault("KNOWLEDGE_DIR", str(ARCHIVE_ROOT / "knowledge"))
os.environ.setdefault("INDEX_DIR", "/tmp/mnemora-index")

# Load dhruv-rag/api.py under its own name: this file's parent folder is also
# called `api`, so a plain `import api` would be ambiguous.
_spec = importlib.util.spec_from_file_location("mnemora_archive_api", ARCHIVE_ROOT / "api.py")
assert _spec and _spec.loader
_module = importlib.util.module_from_spec(_spec)
sys.modules["mnemora_archive_api"] = _module
_spec.loader.exec_module(_module)

from starlette.applications import Starlette  # noqa: E402
from starlette.routing import Mount  # noqa: E402

archive_app = _module.app
app = Starlette(routes=[Mount("/api/archive", app=archive_app), Mount("/", app=archive_app)])

from fastapi import APIRouter, HTTPException

from ...core.config import get_settings
from ...services.knowledge import list_knowledge_files, read_text_file

router = APIRouter(prefix="/knowledge", tags=["knowledge"])


@router.get("")
def list_docs() -> dict[str, list[str]]:
    settings = get_settings()
    return {"files": list_knowledge_files(settings.knowledge_dir)}


@router.get("/{doc_path:path}")
def get_doc(doc_path: str) -> dict[str, str]:
    settings = get_settings()
    target = (settings.knowledge_dir / doc_path).resolve()
    root = settings.knowledge_dir.resolve()

    if root not in target.parents and target != root:
        raise HTTPException(status_code=400, detail="Invalid document path")

    if not target.exists() or not target.is_file():
        raise HTTPException(status_code=404, detail="Document not found")

    return {"path": doc_path, "content": read_text_file(target)}

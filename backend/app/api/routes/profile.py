from fastapi import APIRouter, HTTPException

from ...core.config import get_settings
from ...services.knowledge import read_text_file

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("")
def get_profile_bundle() -> dict[str, str]:
    settings = get_settings()
    person = settings.knowledge_dir / "person.md"
    resume = settings.knowledge_dir / "resume.md"

    if not person.exists():
        raise HTTPException(status_code=404, detail="person.md is missing")

    return {
        "person": read_text_file(person),
        "resume": read_text_file(resume),
    }

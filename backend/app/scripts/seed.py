from __future__ import annotations

import json
from sqlalchemy import func, select

from ..core.config import get_settings
from ..db.models import Project, Skill
from ..db.session import SessionLocal


def _load_seed_data() -> dict[str, list[dict[str, object]]]:
    settings = get_settings()
    seed_path = settings.knowledge_dir / "portfolio_seed.json"
    if not seed_path.exists():
        return {"projects": [], "skills": []}

    with seed_path.open(encoding="utf-8") as handle:
        data = json.load(handle)

    return {
        "projects": list(data.get("projects") or []),
        "skills": list(data.get("skills") or []),
    }


def seed() -> None:
    seed_data = _load_seed_data()

    with SessionLocal() as db:
        project_count = db.scalar(select(func.count(Project.id))) or 0
        if project_count == 0:
            db.add_all(Project(**item) for item in seed_data["projects"])

        skill_count = db.scalar(select(func.count(Skill.id))) or 0
        if skill_count == 0:
            db.add_all(
                Skill(category=item["category"], name=item["name"], proficiency=item.get("proficiency"), sort_order=index)
                for index, item in enumerate(seed_data["skills"], start=1)
            )

        db.commit()


if __name__ == "__main__":
    seed()
    print("Seeded portfolio data.")


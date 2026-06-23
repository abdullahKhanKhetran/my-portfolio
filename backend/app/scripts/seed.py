from __future__ import annotations

from sqlalchemy import select, func

from ..db.models import Project, Skill
from ..db.session import SessionLocal

PROJECTS = [
    {
        "slug": "ilearn",
        "title": "ILearn",
        "summary": "AI-powered student management system with RAG-enabled academic querying.",
        "role": "Full Stack AI Engineer",
        "stack": ["React", "MVC", "Supabase", "FastAPI", "RAG", "DeepSeek LLM"],
        "featured": True,
        "sort_order": 1,
    },
    {
        "slug": "insightops",
        "title": "InsightOps",
        "summary": "MCP-powered incident resolution and debugging assistant.",
        "role": "Full Stack AI Engineer",
        "stack": ["Node.js", "FastAPI", "MCP", "Redis", "PostgreSQL", "Docker", "AWS"],
        "featured": True,
        "sort_order": 2,
    },
    {
        "slug": "talentforge",
        "title": "TalentForge",
        "summary": "AI-powered HR management system with anomaly detection and performance prediction.",
        "role": "Full Stack AI Engineer",
        "stack": ["Flutter", "FastAPI", "Django", "PostgreSQL", "Celery", "Redis", "Docker"],
        "featured": True,
        "sort_order": 3,
    },
    {
        "slug": "classmind",
        "title": "ClassMind",
        "summary": "Academic administration platform with real-time sync and offline-first support.",
        "role": "Full Stack AI Engineer",
        "stack": ["Flutter", "Supabase", "PostgreSQL", "Clean Architecture", "BLoC", "Provider"],
        "featured": True,
        "sort_order": 4,
    },
]

SKILLS = [
    ("Frontend", "Next.js", 90),
    ("Frontend", "React", 90),
    ("Frontend", "Tailwind", 85),
    ("Backend", "FastAPI", 95),
    ("Backend", "Django", 90),
    ("Backend", "PostgreSQL", 90),
    ("Backend", "Supabase", 90),
    ("Backend", "Redis", 80),
    ("Mobile", "Flutter", 95),
    ("AI", "RAG", 90),
    ("AI", "MCP", 85),
    ("AI", "LangChain", 80),
    ("DevOps", "Docker", 85),
    ("DevOps", "AWS", 80),
]


def seed() -> None:
    with SessionLocal() as db:
        project_count = db.scalar(select(func.count(Project.id))) or 0
        if project_count == 0:
            db.add_all(Project(**item) for item in PROJECTS)

        skill_count = db.scalar(select(func.count(Skill.id))) or 0
        if skill_count == 0:
            db.add_all(
                Skill(category=category, name=name, proficiency=proficiency, sort_order=index)
                for index, (category, name, proficiency) in enumerate(SKILLS, start=1)
            )

        db.commit()


if __name__ == "__main__":
    seed()
    print("Seeded portfolio data.")

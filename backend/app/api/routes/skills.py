from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from ...db.models import Skill
from ...deps import get_db
from ...schemas.content import SkillRead

router = APIRouter(prefix="/skills", tags=["skills"])


@router.get("", response_model=list[SkillRead])
def list_skills(db: Session = Depends(get_db)):
    stmt = select(Skill).order_by(Skill.sort_order.asc(), Skill.name.asc())
    return db.scalars(stmt).all()

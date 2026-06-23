from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from ...db.models import Project
from ...deps import get_db
from ...schemas.content import ProjectRead

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=list[ProjectRead])
def list_projects(db: Session = Depends(get_db)):
    stmt = select(Project).order_by(Project.featured.desc(), Project.sort_order.asc(), Project.created_at.desc())
    return db.scalars(stmt).all()

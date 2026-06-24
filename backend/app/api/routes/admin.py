from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ...core.config import get_settings
from ...db.models import ContactMessage, Project, Skill, Testimonial
from ...deps import get_db, require_admin_token
from ...schemas.admin import (
    ContactMessageUpdate,
    KnowledgeFileRead,
    KnowledgeUpdate,
    ProjectCreate,
    ProjectUpdate,
    SkillCreate,
    SkillUpdate,
    TestimonialCreate,
    TestimonialUpdate,
)
from ...schemas.content import ContactMessageRead, ProjectRead, SkillRead, TestimonialRead
from ...services.cloudinary import upload_image
from ...services.knowledge import list_knowledge_files, read_text_file

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(require_admin_token)])


def _resolve_knowledge_path(doc_path: str) -> Path:
    settings = get_settings()
    root = settings.knowledge_dir.resolve()
    target = (settings.knowledge_dir / doc_path).resolve()
    if root not in target.parents and target != root:
        raise HTTPException(status_code=400, detail="Invalid document path")
    return target


@router.get("/projects", response_model=list[ProjectRead])
def admin_list_projects(db: Session = Depends(get_db)):
    stmt = select(Project).order_by(Project.featured.desc(), Project.sort_order.asc(), Project.created_at.desc())
    return db.scalars(stmt).all()


@router.post("/projects", response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
def admin_create_project(payload: ProjectCreate, db: Session = Depends(get_db)):
    project = Project(**payload.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.put("/projects/{project_id}", response_model=ProjectRead)
def admin_update_project(project_id: int, payload: ProjectUpdate, db: Session = Depends(get_db)):
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)
    return project


@router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_project(project_id: int, db: Session = Depends(get_db)):
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()


@router.get("/skills", response_model=list[SkillRead])
def admin_list_skills(db: Session = Depends(get_db)):
    stmt = select(Skill).order_by(Skill.sort_order.asc(), Skill.name.asc())
    return db.scalars(stmt).all()


@router.post("/skills", response_model=SkillRead, status_code=status.HTTP_201_CREATED)
def admin_create_skill(payload: SkillCreate, db: Session = Depends(get_db)):
    skill = Skill(**payload.model_dump())
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill


@router.put("/skills/{skill_id}", response_model=SkillRead)
def admin_update_skill(skill_id: int, payload: SkillUpdate, db: Session = Depends(get_db)):
    skill = db.get(Skill, skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(skill, field, value)

    db.commit()
    db.refresh(skill)
    return skill


@router.delete("/skills/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_skill(skill_id: int, db: Session = Depends(get_db)):
    skill = db.get(Skill, skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    db.delete(skill)
    db.commit()


@router.get("/testimonials", response_model=list[TestimonialRead])
def admin_list_testimonials(db: Session = Depends(get_db)):
    stmt = select(Testimonial).order_by(Testimonial.sort_order.asc(), Testimonial.id.desc())
    return db.scalars(stmt).all()


@router.post("/testimonials/avatar", response_model=MediaUploadResponse, status_code=status.HTTP_201_CREATED)
def admin_upload_testimonial_avatar(file: UploadFile = File(...)):
    settings = get_settings()
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Please upload an image file")

    if not (settings.cloudinary_cloud_name or settings.cloudinary_url):
        raise HTTPException(status_code=503, detail="Cloudinary is not configured")

    result = upload_image(file, folder=f"{settings.cloudinary_folder}/testimonials")
    url = result.get("secure_url") or result.get("url")
    if not url:
        raise HTTPException(status_code=502, detail="Cloudinary did not return an image URL")

    return MediaUploadResponse(
        url=str(url),
        public_id=result.get("public_id"),
        original_filename=file.filename,
    )


@router.post("/testimonials", response_model=TestimonialRead, status_code=status.HTTP_201_CREATED)
def admin_create_testimonial(payload: TestimonialCreate, db: Session = Depends(get_db)):
    testimonial = Testimonial(**payload.model_dump())
    db.add(testimonial)
    db.commit()
    db.refresh(testimonial)
    return testimonial


@router.put("/testimonials/{testimonial_id}", response_model=TestimonialRead)
def admin_update_testimonial(testimonial_id: int, payload: TestimonialUpdate, db: Session = Depends(get_db)):
    testimonial = db.get(Testimonial, testimonial_id)
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(testimonial, field, value)

    db.commit()
    db.refresh(testimonial)
    return testimonial


@router.delete("/testimonials/{testimonial_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_testimonial(testimonial_id: int, db: Session = Depends(get_db)):
    testimonial = db.get(Testimonial, testimonial_id)
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    db.delete(testimonial)
    db.commit()


@router.get("/messages", response_model=list[ContactMessageRead])
def admin_list_messages(db: Session = Depends(get_db)):
    stmt = select(ContactMessage).order_by(ContactMessage.created_at.desc())
    return db.scalars(stmt).all()


@router.put("/messages/{message_id}", response_model=ContactMessageRead)
def admin_update_message(message_id: int, payload: ContactMessageUpdate, db: Session = Depends(get_db)):
    message = db.get(ContactMessage, message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Contact message not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(message, field, value)

    db.commit()
    db.refresh(message)
    return message


@router.delete("/messages/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_message(message_id: int, db: Session = Depends(get_db)):
    message = db.get(ContactMessage, message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Contact message not found")
    db.delete(message)
    db.commit()


@router.get("/knowledge/files")
def admin_list_knowledge_files():
    settings = get_settings()
    return {"files": list_knowledge_files(settings.knowledge_dir)}


@router.get("/knowledge/{doc_path:path}", response_model=KnowledgeFileRead)
def admin_get_knowledge_file(doc_path: str):
    target = _resolve_knowledge_path(doc_path)
    if not target.exists() or not target.is_file():
        raise HTTPException(status_code=404, detail="Document not found")
    return KnowledgeFileRead(path=doc_path, content=read_text_file(target))


@router.put("/knowledge/{doc_path:path}", response_model=KnowledgeFileRead)
def admin_update_knowledge_file(doc_path: str, payload: KnowledgeUpdate):
    settings = get_settings()
    if settings.vercel or settings.environment.lower() == "production":
        raise HTTPException(
            status_code=501,
            detail="Knowledge file editing is disabled on Vercel. Use a persistent storage backend for writable content.",
        )

    target = _resolve_knowledge_path(doc_path)
    if not target.exists() or not target.is_file():
        raise HTTPException(status_code=404, detail="Document not found")
    target.write_text(payload.content, encoding="utf-8")
    return KnowledgeFileRead(path=doc_path, content=payload.content)


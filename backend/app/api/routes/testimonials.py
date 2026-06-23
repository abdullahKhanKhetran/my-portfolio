from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from ...db.models import Testimonial
from ...deps import get_db
from ...schemas.content import TestimonialRead

router = APIRouter(prefix="/testimonials", tags=["testimonials"])


@router.get("", response_model=list[TestimonialRead])
def list_testimonials(db: Session = Depends(get_db)):
    stmt = select(Testimonial).order_by(Testimonial.sort_order.asc(), Testimonial.id.desc())
    return db.scalars(stmt).all()

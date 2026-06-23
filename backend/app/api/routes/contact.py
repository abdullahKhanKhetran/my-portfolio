from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from ...db.models import ContactMessage
from ...deps import get_db
from ...schemas.content import ContactMessageCreate, ContactMessageRead

router = APIRouter(prefix="/contact", tags=["contact"])


@router.post("/messages", response_model=ContactMessageRead, status_code=status.HTTP_201_CREATED)
def create_message(payload: ContactMessageCreate, db: Session = Depends(get_db)):
    message = ContactMessage(
        name=payload.name,
        email=payload.email,
        subject=payload.subject,
        message=payload.message,
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return message

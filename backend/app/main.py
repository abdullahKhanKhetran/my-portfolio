from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.routes.admin import router as admin_router
from .api.routes.blogs import router as blogs_router
from .api.routes.chat import router as chat_router
from .api.routes.contact import router as contact_router
from .api.routes.health import router as health_router
from .api.routes.knowledge import router as knowledge_router
from .api.routes.media import router as media_router
from .api.routes.profile import router as profile_router
from .api.routes.projects import router as projects_router
from .api.routes.skills import router as skills_router
from .api.routes.testimonials import router as testimonials_router
from .core.config import get_settings
from .db.base import Base
from .db.session import engine
from .scripts.seed import seed as seed_portfolio
from .services.cloudinary import configure_cloudinary

settings = get_settings()
configure_cloudinary(settings)
app = FastAPI(title=settings.app_name)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix=settings.api_v1_prefix)
app.include_router(profile_router, prefix=settings.api_v1_prefix)
app.include_router(knowledge_router, prefix=settings.api_v1_prefix)
app.include_router(media_router, prefix=settings.api_v1_prefix)
app.include_router(projects_router, prefix=settings.api_v1_prefix)
app.include_router(skills_router, prefix=settings.api_v1_prefix)
app.include_router(testimonials_router, prefix=settings.api_v1_prefix)
app.include_router(blogs_router, prefix=settings.api_v1_prefix)
app.include_router(contact_router, prefix=settings.api_v1_prefix)
app.include_router(chat_router, prefix=settings.api_v1_prefix)
app.include_router(admin_router, prefix=settings.api_v1_prefix)


@app.on_event("startup")
def startup() -> None:
    # Vercel serverless functions are ephemeral, so we skip local bootstrap work there.
    if settings.vercel or settings.environment.lower() == "production":
        return

    from .db.base import Base
    from .db.session import engine
    from .scripts.seed import seed as seed_portfolio

    Base.metadata.create_all(bind=engine)
    seed_portfolio()


@app.get("/")
def root() -> dict[str, str]:
    return {
        "message": "Portfolio API is running",
        "docs": "/docs",
        "health": f"{settings.api_v1_prefix}/health",
    }


@app.get("/health")
def root_health() -> dict[str, str]:
    return {"status": "ok"}


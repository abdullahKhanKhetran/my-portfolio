from __future__ import annotations

from cloudinary import config as cloudinary_config

from ..core.config import Settings


def configure_cloudinary(settings: Settings) -> None:
    if settings.cloudinary_url:
        cloudinary_config(cloudinary_url=settings.cloudinary_url, secure=True)
        return

    if settings.cloudinary_cloud_name and settings.cloudinary_api_key and settings.cloudinary_api_secret:
        cloudinary_config(
            cloud_name=settings.cloudinary_cloud_name,
            api_key=settings.cloudinary_api_key,
            api_secret=settings.cloudinary_api_secret,
            secure=True,
        )

from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from urllib.parse import quote_plus

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Portfolio API"
    api_v1_prefix: str = "/api/v1"
    environment: str = "development"
    knowledge_dir: Path = Path(__file__).resolve().parents[2] / "knowledge"
    cors_origins: list[str] = ["http://localhost:3000"]

    database_url: str | None = None
    supabase_db_url: str | None = None
    supabase_db_host: str | None = None
    supabase_db_port: int = 5432
    supabase_db_name: str = "postgres"
    supabase_db_user: str = "postgres"
    supabase_db_password: str | None = None
    supabase_db_sslmode: str = "require"

    gemini_api_key: str | None = None
    gemini_model: str = "gemini-2.5-flash"
    gemini_base_url: str = "https://generativelanguage.googleapis.com/v1beta"
    llm_api_key: str | None = None
    llm_model: str | None = None
    llm_base_url: str | None = None

    admin_access_token: str | None = None

    cloudinary_cloud_name: str | None = None
    cloudinary_api_key: str | None = None
    cloudinary_api_secret: str | None = None
    cloudinary_url: str | None = None
    cloudinary_upload_preset: str | None = None
    cloudinary_folder: str = "portfolio"
    hero_image_url: str | None = None

    redis_url: str | None = None
    image_cache_ttl_seconds: int = 60 * 60 * 24 * 30
    vercel: bool = False

    model_config = SettingsConfigDict(
        env_file=(".env", "backend/.env"),
        env_file_encoding="utf-8",
        extra="ignore",
        enable_decoding=False,
    )

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: object) -> list[str]:
        if value is None:
            return ["http://localhost:3000"]
        if isinstance(value, list):
            return [str(item).strip() for item in value if str(item).strip()]
        if isinstance(value, str):
            items = [item.strip() for item in value.split(",")]
            return [item for item in items if item]
        raise TypeError("cors_origins must be a list or comma-separated string")

    @property
    def resolved_gemini_api_key(self) -> str | None:
        return self.gemini_api_key or self.llm_api_key

    @property
    def resolved_gemini_model(self) -> str:
        return self.gemini_model or self.llm_model or "gemini-2.5-flash"

    @property
    def resolved_gemini_base_url(self) -> str:
        return self.gemini_base_url or self.llm_base_url or "https://generativelanguage.googleapis.com/v1beta"

    @staticmethod
    def _sanitize_database_url(url: str) -> str:
        raw = url.strip()
        if "pgbouncer=true" in raw:
            raw = raw.replace("pgbouncer=true", "")
            raw = raw.replace("?&", "?").rstrip("?&")

        scheme_sep = "://"
        if scheme_sep not in raw:
            return raw

        scheme, remainder = raw.split(scheme_sep, 1)
        normalized_scheme = scheme
        if scheme in {"postgres", "postgresql", "postgresql+psycopg2"}:
            normalized_scheme = "postgresql+psycopg"

        if "@" not in remainder:
            return f"{normalized_scheme}://{remainder}"

        credentials, host_part = remainder.rsplit("@", 1)
        if ":" not in credentials:
            return f"{normalized_scheme}://{remainder}"

        username, password = credentials.split(":", 1)
        user_enc = quote_plus(username)
        pass_enc = quote_plus(password)
        return f"{normalized_scheme}://{user_enc}:{pass_enc}@{host_part}"

    def resolve_database_url(self) -> str:
        if self.database_url:
            return self._sanitize_database_url(self.database_url)

        if self.supabase_db_url:
            return self._sanitize_database_url(self.supabase_db_url)

        if self.supabase_db_host and self.supabase_db_password:
            user = quote_plus(self.supabase_db_user)
            password = quote_plus(self.supabase_db_password)
            host = self.supabase_db_host
            port = self.supabase_db_port
            name = self.supabase_db_name
            sslmode = self.supabase_db_sslmode
            return (
                f"postgresql+psycopg://{user}:{password}@{host}:{port}/{name}"
                f"?sslmode={sslmode}"
            )

        if self.environment.lower() == "production":
            raise RuntimeError("A DATABASE_URL or SUPABASE_DB_URL is required in production")

        sqlite_path = (Path(__file__).resolve().parents[2] / "portfolio.db").resolve().as_posix()
        return f"sqlite:///{sqlite_path}"


@lru_cache
def get_settings() -> Settings:
    return Settings()

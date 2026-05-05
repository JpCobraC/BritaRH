from typing import Any
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Configurações da aplicação lidas do .env."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Database
    database_url: str = "postgresql+asyncpg://britarh:britarh_secret@localhost:5432/britarh_db"

    # MinIO / S3
    minio_endpoint_url: str = "http://localhost:9000"
    minio_root_user: str = "minioadmin"
    minio_root_password: str = "minioadmin"
    minio_bucket_curriculos: str = "curriculos"

    # CORS
    cors_origins: Any = ["http://localhost:3000"]

    @field_validator("cors_origins", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Any) -> list[str]:
        """Converte string separada por vírgula ou JSON string em lista."""
        if isinstance(v, str):
            if v.startswith("["):
                import json
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [i.strip() for i in v.split(",")]
        return v

    # JWT Secret para autenticação de recrutadores
    backend_secret: str = "shared-jwt-secret-between-frontend-and-backend"  # DEVE ser alterada em prod!


settings = Settings()

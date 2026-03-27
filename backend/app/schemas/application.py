import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ApplicationProfile(BaseModel):
    """Estrutura dos dados de perfil do candidato."""
    full_name: str = Field(..., min_length=3, max_length=255)
    email: EmailStr
    phone: str = Field(..., max_length=20)
    linkedin_url: str | None = None
    portfolio_url: str | None = None
    summary: str | None = None


class ApplicationBase(BaseModel):
    job_id: uuid.UUID
    candidate_email: EmailStr
    profile_data: dict[str, Any]
    score: int = Field(..., ge=0, le=100)
    message: str | None = None


class ApplicationCreate(ApplicationBase):
    """Esquema para criação via API (corpo JSON)."""
    pass


class ApplicationRead(ApplicationBase):
    """Esquema para leitura (saída da API)."""
    id: uuid.UUID
    resume_url: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

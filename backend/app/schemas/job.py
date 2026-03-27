import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from app.models.models import JobStatus
from app.schemas.question import QuestionCreate, QuestionRead


class JobBase(BaseModel):
    title: str = Field(..., max_length=255)
    area: str = Field(..., max_length=100)
    description: str | None = None
    contract_type: str | None = None
    schedule: str | None = None
    workplace: str | None = None
    requirements: str | None = None
    assignments: str | None = None


class JobCreate(JobBase):
    questions: list[QuestionCreate] = Field(..., min_length=5, max_length=20)


class JobUpdate(BaseModel):
    title: str | None = None
    area: str | None = None
    description: str | None = None
    contract_type: str | None = None
    schedule: str | None = None
    workplace: str | None = None
    requirements: str | None = None
    assignments: str | None = None
    status: JobStatus | None = None


class JobQuestionsUpdate(BaseModel):
    questions: list[QuestionCreate] = Field(..., min_length=5, max_length=20)


class JobRead(JobBase):
    id: uuid.UUID
    status: JobStatus
    created_at: datetime
    questions: list[QuestionRead]
    
    model_config = ConfigDict(from_attributes=True)


class JobSimple(BaseModel):
    """Versão simplificada para listagem pública."""
    id: uuid.UUID
    title: str
    area: str
    workplace: str | None = None
    status: JobStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class JobRecruiter(JobSimple):
    """Versão para o painel do recrutador, inclui contador de candidatos."""
    applicant_count: int = 0

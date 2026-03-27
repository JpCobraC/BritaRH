from datetime import datetime
from enum import Enum
from typing import Any

from sqlalchemy import ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class JobStatus(str, Enum):
    OPEN = "open"
    CLOSED = "closed"


class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), index=True)
    area: Mapped[str] = mapped_column(String(100), index=True)
    description: Mapped[str] = mapped_column(Text)
    status: Mapped[JobStatus] = mapped_column(
        String(20), default=JobStatus.OPEN, server_default=JobStatus.OPEN.value
    )
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())

    # Relacionamentos
    questions: Mapped[list["Question"]] = relationship(back_populates="job", cascade="all, delete-orphan")
    applications: Mapped[list["Application"]] = relationship(back_populates="job", cascade="all, delete-orphan")


class Question(Base):
    __tablename__ = "questions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    job_id: Mapped[int] = mapped_column(ForeignKey("jobs.id", ondelete="CASCADE"))
    text: Mapped[str] = mapped_column(Text)
    options: Mapped[dict[str, Any]] = mapped_column(JSONB)  # Ex: {"0": "Opção A", "1": "Opção B"}
    correct_index: Mapped[int] = mapped_column()

    job: Mapped["Job"] = relationship(back_populates="questions")


class Application(Base):
    __tablename__ = "applications"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    job_id: Mapped[int] = mapped_column(ForeignKey("jobs.id", ondelete="CASCADE"))
    candidate_email: Mapped[str] = mapped_column(String(255), index=True)
    profile_data: Mapped[dict[str, Any]] = mapped_column(JSONB)  # Dados do formulário de perfil
    score: Mapped[int] = mapped_column()  # Pontuação no teste
    message: Mapped[str | None] = mapped_column(Text, nullable=True)
    resume_url: Mapped[str] = mapped_column(Text)  # URL ou path no MinIO
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())

    job: Mapped["Job"] = relationship(back_populates="applications")


class RecruiterWhitelist(Base):
    __tablename__ = "recruiter_whitelist"

    email: Mapped[str] = mapped_column(String(255), primary_key=True, index=True)
    is_active: Mapped[bool] = mapped_column(default=True, server_default="true")

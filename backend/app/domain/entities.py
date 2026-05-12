import uuid
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional


class JobStatus(str, Enum):
    OPEN = "open"
    CLOSED = "closed"


class UserRole(str, Enum):
    CANDIDATE = "candidate"
    RECRUITER = "recruiter"


@dataclass
class Question:
    text: str
    options: Dict[str, str]
    correct_index: int
    id: uuid.UUID = field(default_factory=uuid.uuid4)
    job_id: Optional[uuid.UUID] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


@dataclass
class Application:
    job_id: uuid.UUID
    candidate_email: str
    profile_data: Dict[str, Any]
    score: int
    resume_url: str
    message: Optional[str] = None
    id: uuid.UUID = field(default_factory=uuid.uuid4)
    user_id: Optional[uuid.UUID] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    def __post_init__(self):
        if self.score < 0 or self.score > 100:
            raise ValueError("Score must be between 0 and 100")


@dataclass
class Job:
    title: str
    area: str
    description: Optional[str] = None
    contract_type: Optional[str] = None
    schedule: Optional[str] = None
    workplace: Optional[str] = None
    requirements: Optional[str] = None
    assignments: Optional[str] = None
    status: JobStatus = JobStatus.OPEN
    questions: List[Question] = field(default_factory=list)
    applications: List[Application] = field(default_factory=list)
    id: uuid.UUID = field(default_factory=uuid.uuid4)
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    deleted_at: Optional[datetime] = None

    def is_open(self) -> bool:
        return self.status == JobStatus.OPEN and self.deleted_at is None

    def close(self):
        self.status = JobStatus.CLOSED

    def soft_delete(self):
        self.deleted_at = datetime.utcnow()

    def can_modify_questions(self, has_applicants: bool) -> bool:
        """Regra de negócio: não é possível alterar questões se já houver candidatos."""
        return not has_applicants

    def add_question(self, question: Question):
        # We assume can_modify_questions was called in the usecase because checking DB isn't possible here without making domain depend on DB.
        self.questions.append(question)



@dataclass
class User:
    email: str
    name: str
    role: UserRole = UserRole.CANDIDATE
    hashed_password: Optional[str] = None
    cpf: Optional[str] = None
    birth_date: Optional[datetime] = None
    picture: Optional[str] = None
    id: uuid.UUID = field(default_factory=uuid.uuid4)
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


@dataclass
class RecruiterWhitelist:
    email: str
    is_active: bool = True

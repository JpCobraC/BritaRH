import uuid
from abc import ABC, abstractmethod
from typing import List, Optional

from .entities import Application, Job, RecruiterWhitelist, User


class IJobRepository(ABC):
    @abstractmethod
    async def create(self, job: Job) -> Job:
        pass

    @abstractmethod
    async def get_by_id(self, job_id: uuid.UUID) -> Optional[Job]:
        pass

    @abstractmethod
    async def list_open(self, skip: int = 0, limit: int = 100) -> List[Job]:
        pass

    @abstractmethod
    async def update(self, job: Job) -> Job:
        pass


class IApplicationRepository(ABC):
    @abstractmethod
    async def create(self, application: Application) -> Application:
        pass

    @abstractmethod
    async def count_by_job_id(self, job_id: uuid.UUID) -> int:
        pass

    @abstractmethod
    async def has_user_applied(self, user_id: uuid.UUID, job_id: uuid.UUID) -> bool:
        pass


class IUserRepository(ABC):
    @abstractmethod
    async def create(self, user: User) -> User:
        pass

    @abstractmethod
    async def get_by_id(self, user_id: uuid.UUID) -> Optional[User]:
        pass

    @abstractmethod
    async def get_by_email(self, email: str) -> Optional[User]:
        pass

    @abstractmethod
    async def get_by_cpf(self, cpf: str) -> Optional[User]:
        pass


class IRecruiterWhitelistRepository(ABC):
    @abstractmethod
    async def is_whitelisted(self, email: str) -> bool:
        pass


class IStorageGateway(ABC):
    @abstractmethod
    def upload_file(self, file_content: bytes, filename: str, content_type: str = "application/pdf") -> str:
        pass

    @abstractmethod
    def get_presigned_url(self, object_key: str, expires_in: int = 900) -> str:
        pass

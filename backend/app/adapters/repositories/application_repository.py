import uuid
from typing import Optional, List, Tuple

from sqlalchemy import select, func, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities import Application as DomainApplication
from app.domain.interfaces import IApplicationRepository
from app.models.models import Application as ModelApplication


class ApplicationRepository(IApplicationRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    def _to_domain(self, model: ModelApplication) -> DomainApplication:
        return DomainApplication(
            id=model.id,
            job_id=model.job_id,
            candidate_email=model.candidate_email,
            profile_data=model.profile_data,
            score=model.score,
            resume_url=model.resume_url,
            message=model.message,
            user_id=model.user_id,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

    def _to_model(self, domain: DomainApplication) -> ModelApplication:
        return ModelApplication(
            id=domain.id,
            job_id=domain.job_id,
            candidate_email=domain.candidate_email,
            profile_data=domain.profile_data,
            score=domain.score,
            resume_url=domain.resume_url,
            message=domain.message,
            user_id=domain.user_id,
            created_at=domain.created_at,
            updated_at=domain.updated_at,
        )

    async def create(self, application: DomainApplication) -> DomainApplication:
        model = self._to_model(application)
        self.session.add(model)
        await self.session.commit()
        await self.session.refresh(model)
        return self._to_domain(model)

    async def count_by_job_id(self, job_id: uuid.UUID) -> int:
        stmt = select(func.count(ModelApplication.id)).where(ModelApplication.job_id == job_id)
        result = await self.session.execute(stmt)
        return result.scalar() or 0

    async def has_user_applied(self, user_id: uuid.UUID, job_id: uuid.UUID) -> bool:
        stmt = select(ModelApplication).where(
            ModelApplication.user_id == user_id,
            ModelApplication.job_id == job_id
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none() is not None

    async def has_email_applied(self, email: str, job_id: uuid.UUID) -> bool:
        stmt = select(ModelApplication).where(
            ModelApplication.candidate_email == email,
            ModelApplication.job_id == job_id
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none() is not None

    async def list_by_job_id(self, job_id: uuid.UUID, skip: int = 0, limit: int = 100) -> Tuple[int, List[DomainApplication]]:
        base_stmt = select(ModelApplication).where(ModelApplication.job_id == job_id)
        
        count_stmt = select(func.count()).select_from(base_stmt.subquery())
        count_result = await self.session.execute(count_stmt)
        total = count_result.scalar() or 0

        stmt = base_stmt.offset(skip).limit(limit).order_by(ModelApplication.created_at.desc())
        result = await self.session.execute(stmt)
        models = result.scalars().all()
        return total, [self._to_domain(m) for m in models]

    async def delete_by_job_id(self, job_id: uuid.UUID) -> None:
        stmt = delete(ModelApplication).where(ModelApplication.job_id == job_id)
        await self.session.execute(stmt)
        await self.session.commit()


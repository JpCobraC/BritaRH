import uuid
from typing import List, Optional, Tuple

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.domain.entities import Job as DomainJob, Question as DomainQuestion, JobStatus
from app.domain.interfaces import IJobRepository
from app.models.models import Job as ModelJob, Question as ModelQuestion


class JobRepository(IJobRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    def _to_domain(self, model: ModelJob) -> DomainJob:
        domain_job = DomainJob(
            id=model.id,
            title=model.title,
            area=model.area,
            description=model.description,
            contract_type=model.contract_type,
            schedule=model.schedule,
            workplace=model.workplace,
            requirements=model.requirements,
            assignments=model.assignments,
            status=JobStatus(model.status),
            created_at=model.created_at,
            updated_at=model.updated_at,
            deleted_at=model.deleted_at,
        )
        if hasattr(model, "questions") and model.questions:
            domain_job.questions = [
                DomainQuestion(
                    id=q.id,
                    job_id=q.job_id,
                    text=q.text,
                    options=q.options,
                    correct_index=q.correct_index,
                    created_at=q.created_at,
                    updated_at=q.updated_at,
                )
                for q in model.questions
            ]
        return domain_job

    def _to_model(self, domain: DomainJob) -> ModelJob:
        model_job = ModelJob(
            id=domain.id,
            title=domain.title,
            area=domain.area,
            description=domain.description,
            contract_type=domain.contract_type,
            schedule=domain.schedule,
            workplace=domain.workplace,
            requirements=domain.requirements,
            assignments=domain.assignments,
            status=domain.status.value,
            created_at=domain.created_at,
            updated_at=domain.updated_at,
            deleted_at=domain.deleted_at,
        )
        if domain.questions:
            model_job.questions = [
                ModelQuestion(
                    id=q.id,
                    job_id=domain.id,
                    text=q.text,
                    options=q.options,
                    correct_index=q.correct_index,
                    created_at=q.created_at,
                    updated_at=q.updated_at,
                )
                for q in domain.questions
            ]
        return model_job

    async def create(self, job: DomainJob) -> DomainJob:
        model = self._to_model(job)
        self.session.add(model)
        await self.session.commit()
        await self.session.refresh(model)
        
        # Load questions to ensure it returns correctly
        stmt = select(ModelJob).options(selectinload(ModelJob.questions)).where(ModelJob.id == model.id)
        result = await self.session.execute(stmt)
        refreshed_model = result.scalar_one()
        return self._to_domain(refreshed_model)

    async def get_by_id(self, job_id: uuid.UUID) -> Optional[DomainJob]:
        stmt = select(ModelJob).options(selectinload(ModelJob.questions)).where(
            ModelJob.id == job_id,
            ModelJob.deleted_at.is_(None)
        )
        result = await self.session.execute(stmt)
        model = result.scalar_one_or_none()
        if not model:
            return None
        return self._to_domain(model)

    async def list_open(self, skip: int = 0, limit: int = 100) -> Tuple[int, List[DomainJob]]:
        base_stmt = select(ModelJob).where(
            ModelJob.status == JobStatus.OPEN.value,
            ModelJob.deleted_at.is_(None)
        )
        
        count_stmt = select(func.count()).select_from(base_stmt.subquery())
        count_result = await self.session.execute(count_stmt)
        total = count_result.scalar() or 0

        stmt = base_stmt.offset(skip).limit(limit).order_by(ModelJob.created_at.desc())
        result = await self.session.execute(stmt)
        models = result.scalars().all()
        return total, [self._to_domain(m) for m in models]

    async def update(self, job: DomainJob) -> DomainJob:
        # Pega a model atual e mescla os dados
        stmt = select(ModelJob).options(selectinload(ModelJob.questions)).where(
            ModelJob.id == job.id,
            ModelJob.deleted_at.is_(None)
        )
        result = await self.session.execute(stmt)
        model = result.scalar_one()
        
        # Update scalar fields
        model.title = job.title
        model.area = job.area
        model.description = job.description
        model.contract_type = job.contract_type
        model.schedule = job.schedule
        model.workplace = job.workplace
        model.requirements = job.requirements
        model.assignments = job.assignments
        model.status = job.status.value
        
        await self.session.commit()
        await self.session.refresh(model)
        return self._to_domain(model)

    async def delete(self, job_id: uuid.UUID) -> None:
        stmt = select(ModelJob).where(ModelJob.id == job_id, ModelJob.deleted_at.is_(None))
        result = await self.session.execute(stmt)
        model = result.scalar_one_or_none()
        if model:
            model.deleted_at = func.now()
            await self.session.commit()


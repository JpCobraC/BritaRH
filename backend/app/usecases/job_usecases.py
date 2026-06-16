import uuid
from typing import List, Optional, Tuple

from app.domain.entities import Job as DomainJob, Question as DomainQuestion
from app.domain.interfaces import IJobRepository, IApplicationRepository, IStorageGateway
from app.schemas.job import JobCreate, JobUpdate, JobQuestionsUpdate


class CreateJobUseCase:
    def __init__(self, job_repository: IJobRepository):
        self.job_repository = job_repository

    async def execute(self, job_in: JobCreate) -> DomainJob:
        domain_job = DomainJob(
            title=job_in.title,
            area=job_in.area,
            description=job_in.description,
            contract_type=job_in.contract_type,
            schedule=job_in.schedule,
            workplace=job_in.workplace,
            requirements=job_in.requirements,
            assignments=job_in.assignments,
        )
        for q in job_in.questions:
            domain_job.add_question(
                DomainQuestion(
                    text=q.text,
                    options={str(i): opt for i, opt in enumerate(q.options)},
                    correct_index=q.correct_index,
                )
            )
        return await self.job_repository.create(domain_job)


class ListOpenJobsUseCase:
    def __init__(self, job_repository: IJobRepository):
        self.job_repository = job_repository

    async def execute(self, skip: int = 0, limit: int = 100) -> Tuple[int, List[DomainJob]]:
        return await self.job_repository.list_open(skip=skip, limit=limit)


class GetJobUseCase:
    def __init__(self, job_repository: IJobRepository):
        self.job_repository = job_repository

    async def execute(self, job_id: uuid.UUID) -> Optional[DomainJob]:
        return await self.job_repository.get_by_id(job_id)


class UpdateJobUseCase:
    def __init__(self, job_repository: IJobRepository):
        self.job_repository = job_repository

    async def execute(self, job_id: uuid.UUID, job_in: JobUpdate) -> Optional[DomainJob]:
        job = await self.job_repository.get_by_id(job_id)
        if not job:
            return None

        update_data = job_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(job, field, value)
            
        return await self.job_repository.update(job)


class UpdateJobQuestionsUseCase:
    def __init__(self, job_repository: IJobRepository, application_repository: IApplicationRepository):
        self.job_repository = job_repository
        self.application_repository = application_repository

    async def execute(self, job_id: uuid.UUID, questions_in: JobQuestionsUpdate, simulate_has_applicants: bool = False) -> Optional[DomainJob]:
        job = await self.job_repository.get_by_id(job_id)
        if not job:
            return None

        if simulate_has_applicants:
            has_applicants = True
        else:
            count = await self.application_repository.count_by_job_id(job_id)
            has_applicants = count > 0

        if not job.can_modify_questions(has_applicants):
            raise ValueError("Não é possível alterar as questões pois já existem candidatos para esta vaga.")

        # In the future: update questions logic here
        
        return await self.job_repository.update(job)


class DeleteJobUseCase:
    def __init__(self, job_repository: IJobRepository):
        self.job_repository = job_repository

    async def execute(self, job_id: uuid.UUID) -> bool:
        job = await self.job_repository.get_by_id(job_id)
        if not job:
            return False
        
        job.soft_delete()
        await self.job_repository.delete(job_id)
        return True


class HireCandidateUseCase:
    def __init__(
        self,
        job_repository: IJobRepository,
        application_repository: IApplicationRepository,
        storage_gateway: IStorageGateway,
    ):
        self.job_repository = job_repository
        self.application_repository = application_repository
        self.storage_gateway = storage_gateway

    async def execute(self, job_id: uuid.UUID, candidate_email: str) -> bool:
        job = await self.job_repository.get_by_id(job_id)
        if not job:
            raise ValueError("Vaga não encontrada.")
        if not job.is_open():
            raise ValueError("Esta vaga já está fechada.")

        # Fecha a vaga
        job.close()

        # Busca todas as candidaturas desta vaga (limite alto para garantir que todas sejam processadas)
        _, apps = await self.application_repository.list_by_job_id(job_id=job_id, skip=0, limit=10000)

        # Deleta os currículos do storage
        for app in apps:
            if app.resume_url:
                try:
                    self.storage_gateway.delete_file(app.resume_url)
                except Exception:
                    pass

        # Deleta as candidaturas do banco de dados
        await self.application_repository.delete_by_job_id(job_id)

        # Atualiza a vaga para CLOSED
        await self.job_repository.update(job)
        return True

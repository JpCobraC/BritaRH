import uuid
from typing import Any, Dict

from app.domain.entities import Application as DomainApplication
from app.domain.interfaces import IApplicationRepository, IJobRepository, IUserRepository, IStorageGateway
from app.schemas.application import ApplicationProfile


class SubmitApplicationUseCase:
    def __init__(
        self,
        application_repository: IApplicationRepository,
        job_repository: IJobRepository,
        user_repository: IUserRepository,
        storage_gateway: IStorageGateway,
    ):
        self.application_repository = application_repository
        self.job_repository = job_repository
        self.user_repository = user_repository
        self.storage_gateway = storage_gateway

    async def execute(
        self,
        job_id: uuid.UUID,
        candidate_email: str,
        profile_data_json: str,
        score: int,
        file_content: bytes,
        filename: str,
        message: str | None = None,
    ) -> DomainApplication:
        # 1. Verify Job exists and is open
        job = await self.job_repository.get_by_id(job_id)
        if not job:
            raise ValueError("Vaga não encontrada.")
        if not job.is_open():
            raise ValueError("Esta vaga não está mais recebendo candidaturas.")

        # 2. Check for duplication
        has_applied = await self.application_repository.has_email_applied(candidate_email, job_id)
        if has_applied:
            raise ValueError("Você já se candidatou para esta vaga.")

        # 3. Validate profile data
        try:
            profile_obj = ApplicationProfile.model_validate_json(profile_data_json)
            profile_dict = profile_obj.model_dump()
        except Exception as e:
            raise ValueError(f"Dados de perfil inválidos: {str(e)}")

        # 4. Upload resume
        try:
            object_key = await self.storage_gateway.upload_file(
                file_content=file_content,
                filename=filename,
                content_type="application/pdf"
            )
        except Exception as e:
            raise RuntimeError(f"Falha ao salvar currículo: {str(e)}")

        # 5. Fetch user if exists
        user = await self.user_repository.get_by_email(candidate_email)
        user_id = user.id if user else None

        # 6. Create domain entity
        try:
            application = DomainApplication(
                job_id=job_id,
                user_id=user_id,
                candidate_email=candidate_email,
                profile_data=profile_dict,
                score=score,
                message=message,
                resume_url=object_key
            )
        except ValueError as e:
            raise ValueError(str(e))

        # 7. Persist
        return await self.application_repository.create(application)


class ListApplicationsUseCase:
    def __init__(self, application_repository: IApplicationRepository, job_repository: IJobRepository):
        self.application_repository = application_repository
        self.job_repository = job_repository

    async def execute(self, job_id: uuid.UUID, skip: int = 0, limit: int = 100):
        job = await self.job_repository.get_by_id(job_id)
        if not job:
            raise ValueError("Vaga não encontrada")
            
        return await self.application_repository.list_by_job_id(job_id=job_id, skip=skip, limit=limit)

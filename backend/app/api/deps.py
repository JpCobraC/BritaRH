from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.schemas.user import User
from app.services.auth import check_is_recruiter

# Security scheme
reusable_oauth2 = HTTPBearer()


async def get_current_user(
    db: Annotated[AsyncSession, Depends(get_db)],
    token: Annotated[HTTPAuthorizationCredentials, Depends(reusable_oauth2)],
) -> User:
    """Dependency that will validate the JWT and return the user schema."""
    try:
        # Decodifica o token usando o segredo compartilhado
        payload = jwt.decode(
            token.credentials,
            settings.backend_secret,
            algorithms=["HS256"],
        )
        email: str | None = payload.get("email")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token sem e-mail ou não autorizado.",
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado.",
        )

    # Verifica se o usuário é um recrutador
    is_recruiter = await check_is_recruiter(db, email)

    return User(
        email=email,
        name=payload.get("name"),
        picture=payload.get("picture"),
        is_recruiter=is_recruiter,
    )


async def get_current_recruiter(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    """Dependency that will only accept recruiters."""
    if not current_user.is_recruiter:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso restrito a recrutadores.",
        )
    return current_user

# DI Providers for Clean Architecture

from app.adapters.repositories.job_repository import JobRepository
from app.adapters.repositories.application_repository import ApplicationRepository
from app.adapters.repositories.user_repository import UserRepository
from app.services.storage import storage_service
from app.usecases.job_usecases import CreateJobUseCase, ListOpenJobsUseCase, GetJobUseCase, UpdateJobUseCase, UpdateJobQuestionsUseCase, DeleteJobUseCase, HireCandidateUseCase
from app.usecases.application_usecases import SubmitApplicationUseCase, ListApplicationsUseCase

async def get_job_repository(db: Annotated[AsyncSession, Depends(get_db)]) -> JobRepository:
    return JobRepository(db)

async def get_application_repository(db: Annotated[AsyncSession, Depends(get_db)]) -> ApplicationRepository:
    return ApplicationRepository(db)

async def get_user_repository(db: Annotated[AsyncSession, Depends(get_db)]) -> UserRepository:
    return UserRepository(db)

async def get_create_job_usecase(repo: Annotated[JobRepository, Depends(get_job_repository)]) -> CreateJobUseCase:
    return CreateJobUseCase(repo)

async def get_list_open_jobs_usecase(repo: Annotated[JobRepository, Depends(get_job_repository)]) -> ListOpenJobsUseCase:
    return ListOpenJobsUseCase(repo)

async def get_get_job_usecase(repo: Annotated[JobRepository, Depends(get_job_repository)]) -> GetJobUseCase:
    return GetJobUseCase(repo)

async def get_update_job_usecase(repo: Annotated[JobRepository, Depends(get_job_repository)]) -> UpdateJobUseCase:
    return UpdateJobUseCase(repo)

async def get_update_job_questions_usecase(
    job_repo: Annotated[JobRepository, Depends(get_job_repository)],
    app_repo: Annotated[ApplicationRepository, Depends(get_application_repository)]
) -> UpdateJobQuestionsUseCase:
    return UpdateJobQuestionsUseCase(job_repo, app_repo)

async def get_delete_job_usecase(repo: Annotated[JobRepository, Depends(get_job_repository)]) -> DeleteJobUseCase:
    return DeleteJobUseCase(repo)

async def get_hire_candidate_usecase(
    job_repo: Annotated[JobRepository, Depends(get_job_repository)],
    app_repo: Annotated[ApplicationRepository, Depends(get_application_repository)],
) -> HireCandidateUseCase:
    return HireCandidateUseCase(job_repo, app_repo, storage_service)

async def get_submit_application_usecase(
    app_repo: Annotated[ApplicationRepository, Depends(get_application_repository)],
    job_repo: Annotated[JobRepository, Depends(get_job_repository)],
    user_repo: Annotated[UserRepository, Depends(get_user_repository)]
) -> SubmitApplicationUseCase:
    return SubmitApplicationUseCase(app_repo, job_repo, user_repo, storage_service)

async def get_list_applications_usecase(
    app_repo: Annotated[ApplicationRepository, Depends(get_application_repository)],
    job_repo: Annotated[JobRepository, Depends(get_job_repository)]
) -> ListApplicationsUseCase:
    return ListApplicationsUseCase(app_repo, job_repo)




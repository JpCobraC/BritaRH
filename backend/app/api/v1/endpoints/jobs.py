import uuid
from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException, Query, status, Header, BackgroundTasks
from pydantic import EmailStr

from app.api import deps
from app.schemas.job import JobCreate, JobRead, JobSimple, JobUpdate, JobQuestionsUpdate
from app.schemas.application import ApplicationRead
from app.schemas.pagination import PaginatedResponse
from app.schemas.user import User
from app.usecases.job_usecases import (
    CreateJobUseCase,
    ListOpenJobsUseCase,
    GetJobUseCase,
    UpdateJobUseCase,
    UpdateJobQuestionsUseCase,
    DeleteJobUseCase,
    HireCandidateUseCase,
)
from app.services.email import send_confirmation_email
from app.usecases.application_usecases import ListApplicationsUseCase

router = APIRouter()


@router.get("", response_model=PaginatedResponse[JobSimple])
async def list_jobs(
    usecase: Annotated[ListOpenJobsUseCase, Depends(deps.get_list_open_jobs_usecase)],
    page: int = Query(1, ge=1, description="Número da página"),
    size: int = Query(10, ge=1, le=100, description="Quantidade de itens por página"),
):
    """Lista todas as vagas abertas com paginação."""
    skip = (page - 1) * size
    total, jobs = await usecase.execute(skip=skip, limit=size)
    return PaginatedResponse.create(items=jobs, total=total, page=page, size=size)


@router.post("", response_model=JobRead, status_code=status.HTTP_201_CREATED)
async def create_job(
    *,
    usecase: Annotated[CreateJobUseCase, Depends(deps.get_create_job_usecase)],
    current_user: Annotated[User, Depends(deps.get_current_recruiter)],
    job_in: JobCreate,
):
    """Cria uma nova vaga com suas questões associadas."""
    return await usecase.execute(job_in)


@router.get("/{job_id}", response_model=JobRead)
async def get_job(
    job_id: uuid.UUID,
    usecase: Annotated[GetJobUseCase, Depends(deps.get_get_job_usecase)],
):
    """Retorna detalhes de uma vaga específica."""
    job = await usecase.execute(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Vaga não encontrada")
    return job


@router.patch("/{job_id}", response_model=JobRead)
async def update_job(
    job_id: uuid.UUID,
    job_in: JobUpdate,
    usecase: Annotated[UpdateJobUseCase, Depends(deps.get_update_job_usecase)],
    current_user: Annotated[User, Depends(deps.get_current_recruiter)],
):
    """Atualiza dados básicos da vaga."""
    job = await usecase.execute(job_id, job_in)
    if not job:
        raise HTTPException(status_code=404, detail="Vaga não encontrada")
    return job


@router.patch("/{job_id}/questions", response_model=JobRead)
async def update_job_questions(
    job_id: uuid.UUID,
    questions_in: JobQuestionsUpdate,
    usecase: Annotated[UpdateJobQuestionsUseCase, Depends(deps.get_update_job_questions_usecase)],
    current_user: Annotated[User, Depends(deps.get_current_recruiter)],
    x_simulate_has_applicants: Annotated[str | None, Header()] = None,
):
    """Atualiza as questões da vaga (bloqueado se houver candidatos)."""
    simulate = x_simulate_has_applicants == "true"
    try:
        job = await usecase.execute(job_id, questions_in, simulate_has_applicants=simulate)
        if not job:
            raise HTTPException(status_code=404, detail="Vaga não encontrada")
        return job
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job(
    job_id: uuid.UUID,
    usecase: Annotated[DeleteJobUseCase, Depends(deps.get_delete_job_usecase)],
    current_user: Annotated[User, Depends(deps.get_current_recruiter)],
):
    """Realiza o soft delete de uma vaga."""
    success = await usecase.execute(job_id)
    if not success:
        raise HTTPException(status_code=404, detail="Vaga não encontrada")


@router.get("/{job_id}/applications", response_model=PaginatedResponse[ApplicationRead])
async def list_job_applications(
    job_id: uuid.UUID,
    usecase: Annotated[ListApplicationsUseCase, Depends(deps.get_list_applications_usecase)],
    current_user: Annotated[User, Depends(deps.get_current_recruiter)],
    page: int = Query(1, ge=1, description="Número da página"),
    size: int = Query(10, ge=1, le=100, description="Quantidade de itens por página"),
):
    """Lista as candidaturas de uma vaga específica com paginação."""
    skip = (page - 1) * size
    try:
        total, applications = await usecase.execute(job_id=job_id, skip=skip, limit=size)
        return PaginatedResponse.create(items=applications, total=total, page=page, size=size)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/{job_id}/hire")
async def hire_candidate(
    job_id: uuid.UUID,
    candidate_email: EmailStr,
    usecase: Annotated[HireCandidateUseCase, Depends(deps.get_hire_candidate_usecase)],
    current_user: Annotated[User, Depends(deps.get_current_recruiter)],
    background_tasks: BackgroundTasks,
):
    """
    Contrata um candidato para a vaga, marcando a vaga como fechada
    e excluindo todas as outras candidaturas e currículos de forma definitiva.
    """
    try:
        await usecase.execute(job_id, candidate_email)
        # Envia e-mail de contratação para o candidato em background
        background_tasks.add_task(
            send_confirmation_email,
            candidate_name=candidate_email.split("@")[0].title(),
            candidate_email=candidate_email,
            job_title=f"Vaga {job_id} (CONTRATADO(A))"
        )
        return {"status": "success", "message": "Candidato contratado com sucesso e vaga fechada."}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


import uuid
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api import deps
from app.core.database import get_db
from app.models.models import Job, JobStatus, Question, Application
from app.schemas.job import JobCreate, JobRead, JobSimple, JobUpdate, JobRecruiter, JobQuestionsUpdate
from app.schemas.user import User

router = APIRouter()


@router.get("", response_model=list[JobSimple])
async def list_jobs(
    db: Annotated[AsyncSession, Depends(get_db)],
    skip: int = 0,
    limit: int = 100,
):
    """Retorna apenas vagas com status 'open'."""
    stmt = (
        select(Job)
        .where(Job.status == JobStatus.OPEN)
        .offset(skip)
        .limit(limit)
        .order_by(Job.created_at.desc())
    )
    result = await db.execute(stmt)
    return result.scalars().all()


@router.post("", response_model=JobRead, status_code=status.HTTP_201_CREATED)
async def create_job(
    *,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(deps.get_current_recruiter)],
    job_in: JobCreate,
):
    """Cria uma nova vaga com suas questões associadas."""
    # Transforma o payload em objeto Job e Question
    new_job = Job(
        title=job_in.title,
        area=job_in.area,
        description=job_in.description,
        contract_type=job_in.contract_type,
        schedule=job_in.schedule,
        workplace=job_in.workplace,
        requirements=job_in.requirements,
        assignments=job_in.assignments,
    )
    
    # Adiciona as questões
    for q in job_in.questions:
        new_job.questions.append(
            Question(
                text=q.text,
                options={str(i): opt for i, opt in enumerate(q.options)},
                correct_index=q.correct_index
            )
        )
    
    db.add(new_job)
    await db.commit()
    await db.refresh(new_job)
    
    # Carregar questões para o retorno
    stmt = select(Job).options(selectinload(Job.questions)).where(Job.id == new_job.id)
    result = await db.execute(stmt)
    return result.scalar_one()


@router.get("/{job_id}", response_model=JobRead)
async def get_job(
    job_id: uuid.UUID,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Retorna detalhes de uma vaga específica."""
    stmt = select(Job).options(selectinload(Job.questions)).where(Job.id == job_id)
    result = await db.execute(stmt)
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Vaga não encontrada")
    return job


@router.patch("/{job_id}", response_model=JobRead)
async def update_job(
    job_id: uuid.UUID,
    job_in: JobUpdate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(deps.get_current_recruiter)],
):
    """Atualiza dados básicos da vaga."""
    stmt = select(Job).options(selectinload(Job.questions)).where(Job.id == job_id)
    result = await db.execute(stmt)
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Vaga não encontrada")
    
    update_data = job_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(job, field, value)
    
    await db.commit()
    await db.refresh(job)
    return job


@router.patch("/{job_id}/questions", response_model=JobRead)
async def update_job_questions(
    job_id: uuid.UUID,
    questions_in: JobQuestionsUpdate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(deps.get_current_recruiter)],
    x_simulate_has_applicants: Annotated[str | None, Header()] = None,
):
    """Atualiza as questões da vaga (bloqueado se houver candidatos)."""
    stmt = select(Job).where(Job.id == job_id)
    result = await db.execute(stmt)
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Vaga não encontrada")
        
    # Lógica de trava (Trava real + Simulação para testes)
    has_applicants = False
    if x_simulate_has_applicants == "true":
        has_applicants = True
    else:
        # Check real no banco
        count_stmt = select(func.count(Application.id)).where(Application.job_id == job_id)
        count_result = await db.execute(count_stmt)
        if count_result.scalar() > 0:
            has_applicants = True

    if has_applicants:
        raise HTTPException(
            status_code=409,
            detail="Não é possível alterar as questões pois já existem candidatos para esta vaga."
        )

    # Implementação futura da atualização real das questões
    # (...)
    
    return job

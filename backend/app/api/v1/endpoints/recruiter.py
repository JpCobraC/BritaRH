import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core.database import get_db
from app.models.models import Job, Application
from app.schemas.job import JobRecruiter
from app.schemas.application import ApplicationRead
from app.schemas.recruiter import RecruiterStats
from app.schemas.user import User

router = APIRouter()


@router.get("/stats", response_model=RecruiterStats)
async def get_recruiter_stats(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(deps.get_current_recruiter)],
):
    """Retorna estatísticas consolidadas para o dashboard do recrutador."""
    total_jobs = await db.scalar(select(func.count(Job.id)))
    active_jobs = await db.scalar(select(func.count(Job.id)).where(Job.status == "open"))
    total_apps = await db.scalar(select(func.count(Application.id)))
    
    from datetime import date
    today = date.today()
    apps_today = await db.scalar(
        select(func.count(Application.id)).where(func.date(Application.created_at) == today)
    )

    return RecruiterStats(
        total_jobs=total_jobs or 0,
        active_jobs=active_jobs or 0,
        total_applications=total_apps or 0,
        new_applications_today=apps_today or 0
    )


@router.get("/jobs", response_model=list[JobRecruiter])
async def list_recruiter_jobs(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(deps.get_current_recruiter)],
):
    """Retorna todas as vagas com contagem de candidatos para o painel de recrutador."""
    # Query: Select jobs e subquery ou count lateral de candidatos
    stmt = (
        select(
            Job.id,
            Job.title,
            Job.area,
            Job.workplace,
            Job.status,
            Job.created_at,
            func.count(Application.id).label("applicant_count")
        )
        .outerjoin(Application)
        .group_by(Job.id)
        .order_by(desc(Job.created_at))
    )
    
    result = await db.execute(stmt)
    # Mapear os resultados para o schema JobRecruiter
    jobs = []
    for row in result.all():
        jobs.append(
            JobRecruiter(
                id=row.id,
                title=row.title,
                area=row.area,
                workplace=row.workplace,
                status=row.status,
                created_at=row.created_at,
                applicant_count=row.applicant_count
            )
        )
    return jobs


@router.get("/jobs/{job_id}/applications", response_model=list[ApplicationRead])
async def list_job_applications(
    job_id: uuid.UUID,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(deps.get_current_recruiter)],
):
    """Lista todos os candidatos que se aplicaram a uma vaga específica."""
    # 1. Verifica se a vaga existe
    stmt_job = select(Job).where(Job.id == job_id)
    result_job = await db.execute(stmt_job)
    job = result_job.scalar_one_or_none()
    
    if not job:
        raise HTTPException(status_code=404, detail="Vaga não encontrada")

    # 2. Busca candidaturas
    stmt_app = (
        select(Application)
        .where(Application.job_id == job_id)
        .order_by(desc(Application.score), desc(Application.created_at))
    )
    result_app = await db.execute(stmt_app)
    return result_app.scalars().all()

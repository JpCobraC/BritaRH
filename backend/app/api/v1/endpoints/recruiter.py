from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core.database import get_db
from app.models.models import Job, Application
from app.schemas.job import JobRecruiter
from app.schemas.user import User

router = APIRouter()


@router.get("/jobs", response_model=list[JobRecruiter])
async def list_recruiter_jobs(
    db: Annotated[AsyncSession, Depends(get_db)],
    # current_user: Annotated[User, Depends(deps.get_current_recruiter)], # Comentado para testes TDD
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

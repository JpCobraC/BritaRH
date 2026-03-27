from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import RecruiterWhitelist


async def check_is_recruiter(db: AsyncSession, email: str) -> bool:
    """Verifica se o e-mail está na whitelist de recrutadores e se está ativo."""
    stmt = select(RecruiterWhitelist).where(
        RecruiterWhitelist.email == email,
        RecruiterWhitelist.is_active == True
    )
    result = await db.execute(stmt)
    return result.scalar_one_or_none() is not None

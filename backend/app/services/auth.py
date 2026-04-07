import bcrypt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import RecruiterWhitelist, User, UserRole


def hash_password(password: str) -> str:
    """Criptografa a senha usando bcrypt direto (evita bug do passlib)."""
    # bcrypt exige bytes, então codificamos em utf-8
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica a senha plana contra o hash armazenado."""
    try:
        return bcrypt.checkpw(
            plain_password.encode('utf-8'),
            hashed_password.encode('utf-8')
        )
    except Exception:
        return False


async def check_is_recruiter(db: AsyncSession, email: str) -> bool:
    """
    Verifica se o e-mail é de um recrutador.
    Prioriza o papel ('role') na tabela de usuários, mas também consulta a whitelist.
    """
    # 1. Verifica no banco de usuários
    stmt_user = select(User).where(User.email == email)
    result_user = await db.execute(stmt_user)
    user = result_user.scalar_one_or_none()
    
    if user:
        return user.role == UserRole.RECRUITER

    # 2. Fallback para a whitelist (ex: login social via Google sem usuário pré-criado)
    stmt_wl = select(RecruiterWhitelist).where(
        RecruiterWhitelist.email == email,
        RecruiterWhitelist.is_active == True
    )
    result_wl = await db.execute(stmt_wl)
    return result_wl.scalar_one_or_none() is not None


async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    stmt = select(User).where(User.email == email)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def get_user_by_cpf(db: AsyncSession, cpf: str) -> User | None:
    # Remove qualquer máscara antes de buscar
    clean_cpf = "".join(filter(str.isdigit, cpf))
    stmt = select(User).where(User.cpf == clean_cpf)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()

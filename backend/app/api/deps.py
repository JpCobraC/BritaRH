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

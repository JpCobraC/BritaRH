from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.models import User
from app.schemas.auth import UserRegister, UserLogin, UserRead
from datetime import date as py_date
from app.services.auth import hash_password, verify_password, get_user_by_email, get_user_by_cpf

router = APIRouter()

@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserRegister, db: AsyncSession = Depends(get_db)):
    """Cria um novo usuário com senha hashed, validação de CPF e idade."""
    # 1. Verifica E-mail
    existing_user_email = await get_user_by_email(db, user_in.email)
    if existing_user_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="E-mail já cadastrado."
        )

    # 2. Verifica CPF (limpando máscara)
    clean_cpf = "".join(filter(str.isdigit, user_in.cpf))
    existing_user_cpf = await get_user_by_cpf(db, clean_cpf)
    if existing_user_cpf:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="CPF já cadastrado."
        )

    # 3. Valida Idade (Mínimo 14 anos)
    today = py_date.today()
    age = today.year - user_in.birth_date.year - ((today.month, today.day) < (user_in.birth_date.month, user_in.birth_date.day))
    if age < 14:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A idade mínima para cadastro é de 14 anos."
        )
    
    # 4. Cria o usuário
    new_user = User(
        email=user_in.email,
        hashed_password=hash_password(user_in.password),
        name=user_in.name,
        cpf=clean_cpf,
        birth_date=user_in.birth_date,
        role=user_in.role
    )
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    return new_user

@router.post("/login", response_model=UserRead)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    """Valida credenciais e retorna dados do usuário (NextAuth chamará este endpoint)."""
    user = await get_user_by_email(db, credentials.email)
    
    if not user or not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas."
        )
    
    if not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas."
        )
    
    return user

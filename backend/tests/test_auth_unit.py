import pytest
from app.services.auth import hash_password, verify_password, get_user_by_cpf
from app.models.models import User
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

def test_hash_and_verify_password():
    """Valida que o hashing de senha funciona e é verificável."""
    password = "secret_password_123"
    hashed = hash_password(password)
    
    assert hashed != password
    assert verify_password(password, hashed) is True
    assert verify_password("wrong_password", hashed) is False

def test_verify_password_invalid_hash():
    """Valida que hashes inválidos não quebram a aplicação."""
    assert verify_password("anything", "invalid-hash") is False
    assert verify_password("anything", "") is False

@pytest.mark.asyncio
async def test_get_user_by_cpf_cleaning(db_session: AsyncSession):
    """Valida que a busca por CPF ignora pontuação (limpeza automática)."""
    clean_cpf = "12345678901"
    masked_cpf = "123.456.789-01"
    
    # Cria um usuário com CPF limpo
    user = User(
        email="cpf-test@example.com",
        name="CPF Tester",
        cpf=clean_cpf,
        role="candidate"
    )
    db_session.add(user)
    await db_session.commit()
    
    # Busca usando o CPF com máscara
    found_user = await get_user_by_cpf(db_session, masked_cpf)
    
    assert found_user is not None
    assert found_user.cpf == clean_cpf
    assert found_user.email == "cpf-test@example.com"

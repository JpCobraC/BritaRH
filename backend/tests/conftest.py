import pytest
import pytest_asyncio
from unittest.mock import MagicMock, patch
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.pool import NullPool

from app.main import app
from app.api import deps
from app.core.database import get_db, Base
from app.core.config import settings
from app.services.auth import create_access_token

# ─── Configuração de Banco de Testes ──────────────────────────────────────────
# Garantimos que os testes usem um banco isolado (ou pelo menos limpo)
# Para este projeto, usaremos o DATABASE_URL mas com limpeza automática
test_engine = create_async_engine(
    settings.database_url,
    poolclass=NullPool,
)

TestAsyncSessionLocal = async_sessionmaker(
    bind=test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_test_db():
    """Cria as tabelas no início da sessão de testes e as remove no final."""
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    
    # ─── Semente de Recruiter para Testes ─────────────────────────────────────
    from app.models.models import RecruiterWhitelist
    async with TestAsyncSessionLocal() as session:
        session.add(RecruiterWhitelist(email="recruiter@test.com", is_active=True))
        await session.commit()

    yield
    # Removido drop_all para permitir persistência de dados de demo/seed no ambiente compartilhado
    # async with test_engine.begin() as conn:
    #     await conn.run_sync(Base.metadata.drop_all)

@pytest_asyncio.fixture(scope="function")
async def db_session():
    """Fornece uma sessão de banco limpa para cada teste."""
    async with TestAsyncSessionLocal() as session:
        yield session
        await session.rollback()

# ─── Mocks e Overrides ────────────────────────────────────────────────────────

@pytest.fixture(scope="function")
def mock_recruiter():
    """Simula um recrutador autenticado."""
    from app.schemas.user import User
    return User(
        email="recruiter@test.com",
        name="Teste Recrutador",
        role="recruiter"
    )

@pytest.fixture(scope="function")
def override_auth(mock_recruiter):
    """Aplica o mock de autenticação nas rotas de recrutador para facilitar testes simples."""
    async def _mock_auth():
        return mock_recruiter
    app.dependency_overrides[deps.get_current_recruiter] = _mock_auth
    yield
    app.dependency_overrides.pop(deps.get_current_recruiter, None)

async def override_get_db():
    async with TestAsyncSessionLocal() as session:
        yield session

app.dependency_overrides[get_db] = override_get_db

@pytest_asyncio.fixture(scope="function")
async def client() -> AsyncClient:
    """Cliente HTTP assíncrono."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://testserver"
    ) as ac:
        yield ac

@pytest.fixture
def recruiter_token() -> str:
    """Gera um token JWT real para um recrutador de teste."""
    return create_access_token(
        data={
            "email": "recruiter@test.com",
            "name": "Teste Recrutador",
            "role": "recruiter"
        }
    )

@pytest_asyncio.fixture(scope="function")
async def recruiter_client(recruiter_token) -> AsyncClient:
    """Cliente HTTP com token de recrutador já injetado."""
    async with AsyncClient(
        transport=ASGITransport(app=app), 
        base_url="http://testserver",
        headers={"Authorization": f"Bearer {recruiter_token}"}
    ) as ac:
        yield ac

@pytest.fixture
def auth_recruiter_header(recruiter_token) -> dict:
    """Cabeçalho com Bearer Token real para recrutadores."""
    return {"Authorization": f"Bearer {recruiter_token}"}

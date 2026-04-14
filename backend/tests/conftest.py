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
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest_asyncio.fixture(scope="function")
async def db_session():
    """Fornece uma sessão de banco limpa para cada teste."""
    async with TestAsyncSessionLocal() as session:
        yield session
        await session.rollback()

# ─── Mocks e Overrides ────────────────────────────────────────────────────────

@pytest.fixture(autouse=True)
def mock_storage():
    """Impede que os testes tentem fazer upload real para o MinIO."""
    with patch("app.api.v1.endpoints.applications.storage_service") as mock:
        mock.upload_file.return_value = "mock_resume_path.pdf"
        yield mock

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
def auth_recruiter_header():
    """Cabeçalho simples para simular autenticação se necessário (ajustar conforme auth real)."""
    return {"Authorization": "Bearer mock-token-recruiter"}

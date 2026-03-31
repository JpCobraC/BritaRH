import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.pool import NullPool

from app.main import app
from app.api import deps
from app.core.database import get_db
from app.core.config import settings
from app.schemas.user import User

# ─── Mocks para Segurança ───────────────────────────────────────────────────
async def override_get_current_recruiter():
    """Simula um recrutador autenticado para testes."""
    return User(
        email="test-recruiter@britasul.com.br",
        name="Test Recruiter",
        is_recruiter=True
    )

# Override da dependência globalmente para os testes
app.dependency_overrides[deps.get_current_recruiter] = override_get_current_recruiter

# ─── Configuração de Banco de Testes ──────────────────────────────────────────
# Usamos NullPool para evitar que conexões persistam entre diferentes event loops
# criados pelo pytest-asyncio, o que causaria o erro "Task attached to a different loop".
test_engine = create_async_engine(
    settings.database_url,
    poolclass=NullPool,
)

TestAsyncSessionLocal = async_sessionmaker(
    bind=test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

async def override_get_db():
    async with TestAsyncSessionLocal() as session:
        yield session

# Override da dependência globalmente para os testes
app.dependency_overrides[get_db] = override_get_db


@pytest_asyncio.fixture(scope="function")
async def client() -> AsyncClient:
    """Cliente HTTP assíncrono apontando para o app FastAPI."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://testserver"
    ) as ac:
        yield ac

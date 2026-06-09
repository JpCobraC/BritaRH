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

import os
from urllib.parse import urlparse, urlunparse
from sqlalchemy import text

# ─── Configuração de Banco de Testes ──────────────────────────────────────────
# Garantimos que os testes usem um banco isolado e seguro para não apagar dados reais.

def get_test_database_url() -> str:
    """Retorna a URL do banco de dados de teste, isolando do banco de desenvolvimento/produção."""
    test_url = os.getenv("TEST_DATABASE_URL")
    if test_url:
        return test_url

    db_url = settings.database_url
    parsed = urlparse(db_url)
    hostname = parsed.hostname or ""

    # Verifica se o host é local/desenvolvimento
    is_local = hostname in ("localhost", "127.0.0.1", "db", "localhost.localdomain")

    # Bloqueia bancos remotos (ex: Neon) para evitar queda acidental de tabelas de prod/dev
    if "neon.tech" in hostname or not is_local:
        raise ValueError(
            f"REFUSAL TO RUN TESTS: The configured database host '{hostname}' appears to be a remote/shared database. "
            f"Running tests on it would run drop_all and delete your data! "
            f"Please configure a local test database or set the TEST_DATABASE_URL environment variable."
        )

    # Constrói um banco com sufixo _test (ex: britarh_db -> britarh_db_test)
    path = parsed.path.lstrip("/")
    if not path.endswith("_test"):
        test_path = f"/{path}_test"
        parsed = parsed._replace(path=test_path)

    return urlunparse(parsed)


test_database_url = get_test_database_url()

test_engine = create_async_engine(
    test_database_url,
    poolclass=NullPool,
)

TestAsyncSessionLocal = async_sessionmaker(
    bind=test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def ensure_test_database_exists(test_url: str):
    """Cria o banco de dados de teste localmente se ele não existir."""
    parsed_original = urlparse(settings.database_url)
    parsed_test = urlparse(test_url)
    
    test_db_name = parsed_test.path.lstrip("/")
    original_db_name = parsed_original.path.lstrip("/")
    
    if test_db_name == original_db_name:
        return
        
    # Só tenta criar dinamicamente se o driver/banco for PostgreSQL
    if not parsed_test.scheme.startswith("postgresql"):
        return
        
    # Conecta no banco default 'postgres' do servidor de testes para criar o banco de teste
    # Usamos isolation_level AUTOCOMMIT para permitir a execução de CREATE DATABASE
    temp_parsed = parsed_test._replace(path="/postgres")
    temp_url = urlunparse(temp_parsed)
    temp_engine = create_async_engine(temp_url, isolation_level="AUTOCOMMIT")
    try:
        async with temp_engine.connect() as conn:
            result = await conn.execute(
                text("SELECT 1 FROM pg_database WHERE datname = :dbname"),
                {"dbname": test_db_name}
            )
            exists = result.scalar()
            if not exists:
                await conn.execute(text(f'CREATE DATABASE "{test_db_name}"'))
                print(f"Banco de dados de teste criado: {test_db_name}")
    except Exception as e:
        print(f"Aviso: Não foi possível criar automaticamente o banco '{test_db_name}': {e}")
    finally:
        await temp_engine.dispose()


@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_test_db():
    """Cria as tabelas no início da sessão de testes e as remove no final."""
    # Garante que o banco de teste existe antes de conectar o engine de testes
    await ensure_test_database_exists(test_database_url)

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

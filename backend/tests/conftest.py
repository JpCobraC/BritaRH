"""
Fixtures compartilhadas para todos os testes do backend BritaRH.

Usa httpx.AsyncClient com o app FastAPI em modo ASGI — sem rede real,
sem banco real (banco é mockado via override de dependência).
"""

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport

# Importado aqui para que o pytest falhe claramente se o módulo não existir.
# O app ainda não existe → este import vai falhar (RED phase do TDD).
from app.main import app  # noqa: F401  → RED: create app/main.py first


@pytest_asyncio.fixture
async def client() -> AsyncClient:
    """Cliente HTTP assíncrono apontando para o app FastAPI."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://testserver"
    ) as ac:
        yield ac

"""
Testes do endpoint de health check — project-setup spec.

Spec: GET /api/v1/health SHALL retornar {"status": "ok"} com HTTP 200.

Estado TDD: RED — vão falhar até que app/main.py e a rota sejam criados.
"""

import pytest


@pytest.mark.asyncio
async def test_health_check_returns_200(client):
    """Endpoint /api/v1/health deve responder com HTTP 200."""
    response = await client.get("/api/v1/health")
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_health_check_returns_ok_body(client):
    """Endpoint /api/v1/health deve retornar JSON {"status": "ok"}."""
    response = await client.get("/api/v1/health")
    assert response.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_health_check_content_type_json(client):
    """Endpoint /api/v1/health deve retornar Content-Type application/json."""
    response = await client.get("/api/v1/health")
    assert "application/json" in response.headers["content-type"]

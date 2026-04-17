import pytest
from httpx import AsyncClient
from app.services.auth import create_access_token
from datetime import timedelta

@pytest.mark.asyncio
async def test_access_recruiter_route_as_normal_user(client: AsyncClient):
    """
    Testa que um usuário autenticado mas não presente na Whitelist de recrutadores
    recebe 403 Forbidden ao tentar acessar rotas de recrutador.
    """
    # 1. Cria token para um usuário qualquer (não está na whitelist do conftest)
    unauthorized_data = {"email": "not_recruiter@test.com"}
    token = create_access_token(unauthorized_data)
    
    # 2. Tenta acessar estatísticas do recrutador
    response = await client.get(
        "/api/v1/recruiter/stats",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    # Deve retornar 403 Forbidden, pois a dependência get_current_recruiter valida a whitelist
    assert response.status_code == 403
    assert "Acesso restrito a recrutadores" in response.json()["detail"]

@pytest.mark.asyncio
async def test_access_with_invalid_token(client: AsyncClient):
    """Testa que tokens malformados retornam 401."""
    response = await client.get(
        "/api/v1/recruiter/stats",
        headers={"Authorization": "Bearer invalid_token_here"}
    )
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_access_with_expired_token(client: AsyncClient):
    """Testa que tokens expirados retornam 401."""
    expired_data = {"email": "expired@test.com"}
    # Cria token que expirou há 1 hora
    token = create_access_token(expired_data, expires_delta=timedelta(hours=-1))
    
    response = await client.get(
        "/api/v1/recruiter/stats",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 401
    assert "Token inválido ou expirado" in response.json()["detail"]

import pytest
import json
from unittest import mock
from httpx import AsyncClient
from app.api import deps
from app.main import app

@pytest.mark.asyncio
async def test_security_headers_present(client: AsyncClient):
    """Verifica se os cabeçalhos de segurança estão presentes na resposta."""
    response = await client.get("/api/v1/health")
    assert response.headers["X-Content-Type-Options"] == "nosniff"
    assert response.headers["X-Frame-Options"] == "DENY"
    assert "Strict-Transport-Security" in response.headers

@pytest.mark.asyncio
async def test_upload_size_limit_enforced(client: AsyncClient):
    """Verifica se o limite de 5MB para upload de currículos é respeitado."""
    # Cria uma vaga mockada
    # (Como o conftest já tem o override de Recruiter, podemos criar a vaga)
    job_payload = {
        "title": "Vaga para Teste de Segurança",
        "area": "Segurança",
        "questions": [{"text": f"Q{i}", "options": ["A","B"], "correct_index": 0} for i in range(5)]
    }
    job_resp = await client.post("/api/v1/jobs", json=job_payload)
    job_id = job_resp.json()["id"]

    # Cria um payload de 6MB
    large_content = b"P" * (6 * 1024 * 1024)
    data = {
        "job_id": job_id,
        "candidate_email": "attacker@hack.com",
        "profile_data": json.dumps({"full_name": "Attacker"}),
        "score": 0
    }
    files = {"file": ("big.pdf", large_content, "application/pdf")}

    response = await client.post("/api/v1/applications/submit", data=data, files=files)
    
    # 413 Request Entity Too Large
    assert response.status_code == 413
    assert "no máximo 5MB" in response.json()["detail"]

@pytest.mark.asyncio
async def test_protected_routes_unauthorized_without_token():
    """Verifica se rotas protegidas retornam 401 se o override estiver desativado."""
    # Removemos temporariamente o override para testar a proteção real
    original_overrides = app.dependency_overrides.copy()
    if deps.get_current_recruiter in app.dependency_overrides:
        del app.dependency_overrides[deps.get_current_recruiter]
    
    from httpx import ASGITransport
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Tentamos listar jobs de recrutador sem token
        response = await client.get("/api/v1/recruiter/jobs")
        assert response.status_code == 401 # No Bearer token provider
        
    # Restauramos os overrides para não quebrar outros testes
    app.dependency_overrides = original_overrides

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
async def test_upload_size_limit_enforced(recruiter_client: AsyncClient):
    """Verifica se o limite de 5MB para upload de currículos é respeitado."""
    # Cria uma vaga usando o cliente autenticado
    job_payload = {
        "title": "Vaga para Teste de Segurança",
        "area": "Segurança",
        "questions": [{"text": f"Q{i}", "options": ["A","B"], "correct_index": 0} for i in range(5)]
    }
    job_resp = await recruiter_client.post("/api/v1/jobs", json=job_payload)
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

    response = await recruiter_client.post("/api/v1/applications/submit", data=data, files=files)
    
    # 413 Request Entity Too Large
    assert response.status_code == 413
    assert "no máximo 5MB" in response.json()["detail"]

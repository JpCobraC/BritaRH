import uuid
import json
import pytest
from httpx import AsyncClient

def _job_payload():
    return {
        "title": "Desenvolvedor Backend",
        "area": "Tecnologia",
        "description": "Vaga para desenvolvedor Python/FastAPI",
        "questions": [
            {"text": "O que é FastAPI?", "options": ["Framework", "Banco de dados", "Linguagem", "OS"], "correct_index": 0},
            {"text": "Q2", "options": ["A", "B", "C", "D"], "correct_index": 1},
            {"text": "Q3", "options": ["A", "B", "C", "D"], "correct_index": 1},
            {"text": "Q4", "options": ["A", "B", "C", "D"], "correct_index": 1},
            {"text": "Q5", "options": ["A", "B", "C", "D"], "correct_index": 1},
        ]
    }

@pytest.mark.asyncio
async def test_submit_application_success(client: AsyncClient):
    """POST /api/v1/applications/submit deve salvar candidatura e currículo."""
    # 1. Cria uma vaga primeiro
    job_resp = await client.post("/api/v1/jobs", json=_job_payload())
    job_id = job_resp.json()["id"]

    # 2. Dados da candidatura
    candidate_email = "candidato@teste.com"
    profile_data = {
        "full_name": "João Teste",
        "email": candidate_email,
        "phone": "11999999999",
        "summary": "Experiência com Python"
    }

    # 3. Prepara o multipart/form-data
    data = {
        "job_id": job_id,
        "candidate_email": candidate_email,
        "profile_data": json.dumps(profile_data),
        "score": 85,
        "message": "Gostaria muito desta vaga!"
    }
    
    files = {
        "file": ("curriculo.pdf", b"%PDF-1.4 mock content", "application/pdf")
    }

    # 4. Envia a candidatura
    resp = await client.post("/api/v1/applications/submit", data=data, files=files)
    
    assert resp.status_code == 200
    data_out = resp.json()
    assert data_out["candidate_email"] == candidate_email
    assert data_out["score"] == 85
    assert "resume_url" in data_out
    assert data_out["resume_url"].endswith(".pdf")

@pytest.mark.asyncio
async def test_submit_application_duplicate(client: AsyncClient):
    """POST /api/v1/applications/submit deve bloquear candidaturas duplicadas (409)."""
    job_resp = await client.post("/api/v1/jobs", json=_job_payload())
    job_id = job_resp.json()["id"]
    email = "duplicate@teste.com"

    data = {
        "job_id": job_id, "candidate_email": email, 
        "profile_data": json.dumps({"full_name": "Double"}), "score": 70
    }
    files = {"file": ("c.pdf", b"pdf", "application/pdf")}

    # Primeira vez - Sucesso
    resp1 = await client.post("/api/v1/applications/submit", data=data, files=files)
    assert resp1.status_code == 200

    # Segunda vez - Conflito
    resp2 = await client.post("/api/v1/applications/submit", data=data, files=files)
    assert resp2.status_code == 409
    assert "já se candidatou" in resp2.json()["detail"]

@pytest.mark.asyncio
async def test_submit_application_invalid_file_type(client: AsyncClient):
    """POST /api/v1/applications/submit deve rejeitar arquivos que não sejam PDF (400)."""
    job_resp = await client.post("/api/v1/jobs", json=_job_payload())
    job_id = job_resp.json()["id"]

    data = {
        "job_id": job_id, "candidate_email": "wrong@file.com", 
        "profile_data": "{}", "score": 50
    }
    # Envia um .txt
    files = {"file": ("virus.exe", b"not a pdf", "text/plain")}

    resp = await client.post("/api/v1/applications/submit", data=data, files=files)
    assert resp.status_code == 400
    assert "Apenas arquivos PDF" in resp.json()["detail"]

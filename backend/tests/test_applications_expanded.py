import pytest
import uuid
import json
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_submit_application_to_nonexistent_job(client: AsyncClient):
    # UUID aleatório garantindo que a vaga não existe
    wrong_id = str(uuid.uuid4())
    profile_data = {"full_name": "Fail Candidate", "phone": "123456", "email": "fail@test.com"}
    data = {
        "job_id": wrong_id,
        "candidate_email": f"fail_{uuid.uuid4()}@test.com",
        "profile_data": json.dumps(profile_data),
        "score": 0
    }
    files = {"file": ("resume.pdf", b"%PDF-1.4", "application/pdf")}
    
    response = await client.post("/api/v1/applications/submit", data=data, files=files)
    assert response.status_code == 404

@pytest.mark.asyncio
async def test_submit_application_duplicate_email_per_job(recruiter_client: AsyncClient):
    # 1. Cria vaga única para este teste com 5 questões (mínimo exigido pelo schema)
    job_res = await recruiter_client.post(
        "/api/v1/jobs",
        json={
            "title": f"Vaga_{uuid.uuid4()}", 
            "area": "TI", 
            "description": "D", 
            "questions": [
                {"text": f"Q{i}", "options": ["A", "B"], "correct_index": 0} for i in range(5)
            ]
        }
    )
    assert job_res.status_code == 201
    job_id = job_res.json()["id"]
    
    unique_email = f"dup_{uuid.uuid4()}@test.com"
    profile_data = {"full_name": "Duplicate Candidate", "phone": "123456", "email": unique_email}
    data = {
        "job_id": job_id,
        "candidate_email": unique_email,
        "profile_data": json.dumps(profile_data),
        "score": 50
    }
    files = {"file": ("1.pdf", b"%PDF-1.4", "application/pdf")}
    
    # Primeiro envio
    await recruiter_client.post("/api/v1/applications/submit", data=data, files=files)
    
    # Segundo envio
    response = await recruiter_client.post("/api/v1/applications/submit", data=data, files=files)
    assert response.status_code == 409 # Alterado de 400 para 409 (Conflict) conforme o código real
    assert "já se candidatou" in response.json()["detail"]

@pytest.mark.asyncio
async def test_get_application_not_found(recruiter_client: AsyncClient):
    response = await recruiter_client.get(f"/api/v1/applications/{uuid.uuid4()}")
    assert response.status_code == 404

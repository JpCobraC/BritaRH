import pytest
from httpx import AsyncClient
import uuid

import json
import uuid

@pytest.mark.asyncio
async def test_get_recruiter_stats(recruiter_client: AsyncClient):
    # Criar uma vaga para ter dados (Precisa de 5 questões)
    await recruiter_client.post(
        "/api/v1/jobs",
        json={
            "title": "Vaga Teste Stats",
            "area": "TI",
            "description": "Desc",
            "questions": [
                {"text": f"Q{i}", "options": ["A", "B"], "correct_index": 0} for i in range(5)
            ]
        }
    )
    
    response = await recruiter_client.get("/api/v1/recruiter/stats")
    assert response.status_code == 200
    data = response.json()
    assert "total_jobs" in data
    assert data["total_jobs"] >= 1
    assert "total_applications" in data

@pytest.mark.asyncio
async def test_recruiters_can_see_applicants(recruiter_client: AsyncClient):
    # 1. Cria vaga (Precisa de 5 questões)
    job_res = await recruiter_client.post(
        "/api/v1/jobs",
        json={
            "title": "Vaga com Candidato",
            "area": "TI",
            "description": "Desc",
            "questions": [
                {"text": f"Q{i}", "options": ["A", "B"], "correct_index": 0} for i in range(5)
            ]
        }
    )
    assert job_res.status_code == 201
    job_id = job_res.json()["id"]
    
    # 2. Candidatar-se (Multipart/Form data)
    profile_data = {"full_name": "Applicant Real Name", "phone": "12345678", "email": f"app_{uuid.uuid4()}@test.com"}
    data = {
        "job_id": job_id,
        "candidate_email": profile_data["email"],
        "profile_data": json.dumps(profile_data),
        "score": 80
    }
    files = {"file": ("resume.pdf", b"%PDF-1.4", "application/pdf")}
    await recruiter_client.post("/api/v1/applications/submit", data=data, files=files)
    
    # 3. Recrutador lista candidatos (rota correta é /applications)
    response = await recruiter_client.get(f"/api/v1/recruiter/jobs/{job_id}/applications")
    assert response.status_code == 200
    applicants = response.json()
    assert len(applicants) == 1

@pytest.mark.asyncio
async def test_recruiter_action_on_nonexistent_job(recruiter_client: AsyncClient):
    wrong_id = str(uuid.uuid4())
    response = await recruiter_client.get(f"/api/v1/recruiter/jobs/{wrong_id}/applicants")
    assert response.status_code == 404

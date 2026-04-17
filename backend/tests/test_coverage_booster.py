import pytest
import uuid
import json
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_jobs_pagination_and_sorting(recruiter_client: AsyncClient):
    """Testa paginação na listagem pública de vagas."""
    # Criar 3 vagas
    for i in range(3):
        await recruiter_client.post(
            "/api/v1/jobs",
            json={
                "title": f"Paginated Job {i}",
                "area": "Test",
                "questions": [{"text": f"Q{j}?", "options": ["A", "B"], "correct_index": 0} for j in range(5)]
            }
        )
    
    # Testa limit=1
    resp = await recruiter_client.get("/api/v1/jobs?limit=1")
    assert resp.status_code == 200
    assert len(resp.json()) == 1
    
    # Testa skip=1
    resp_skip = await recruiter_client.get("/api/v1/jobs?skip=1&limit=10")
    assert resp_skip.status_code == 200
    # O tamanho depende de quantas vagas já existiam no banco de teste global
    assert len(resp_skip.json()) >= 2

@pytest.mark.asyncio
async def test_update_job_status_and_fields(recruiter_client: AsyncClient):
    """Testa atualização de diversos campos de uma vaga."""
    create_resp = await recruiter_client.post(
        "/api/v1/jobs",
        json={
            "title": "Old Title",
            "area": "Old Area",
            "questions": [{"text": f"Q{i}", "options": ["A", "B"], "correct_index": 0} for i in range(5)]
        }
    )
    job_id = create_resp.json()["id"]
    
    # Atualiza área e workplace
    patch_resp = await recruiter_client.patch(
        f"/api/v1/jobs/{job_id}",
        json={"area": "New Area", "workplace": "Remote"}
    )
    assert patch_resp.status_code == 200
    data = patch_resp.json()
    assert data["area"] == "New Area"
    assert data["workplace"] == "Remote"

@pytest.mark.asyncio
async def test_list_recruiter_jobs_with_counts(recruiter_client: AsyncClient):
    """Testa a listagem do recrutador com contagem de candidatos."""
    # 1. Cria vaga
    job_res = await recruiter_client.post(
        "/api/v1/jobs",
        json={
            "title": "Count Test",
            "area": "TI",
            "questions": [{"text": f"Q{i}", "options": ["A", "B"], "correct_index": 0} for i in range(5)]
        }
    )
    job_id = job_res.json()["id"]
    
    # 2. Envia 2 candidaturas
    for i in range(2):
        email = f"booster_{i}_{uuid.uuid4()}@test.com"
        profile = {"full_name": f"Tester {i}", "phone": "123", "email": email}
        data = {
            "job_id": job_id,
            "candidate_email": email,
            "profile_data": json.dumps(profile),
            "score": 10 * i
        }
        files = {"file": ("test.pdf", b"%PDF-1.4", "application/pdf")}
        await recruiter_client.post("/api/v1/applications/submit", data=data, files=files)
    
    # 3. Verifica contagem no dashboard
    resp = await recruiter_client.get("/api/v1/recruiter/jobs")
    assert resp.status_code == 200
    jobs = resp.json()
    my_job = next(j for j in jobs if j["id"] == job_id)
    assert my_job["applicant_count"] == 2

@pytest.mark.asyncio
async def test_get_job_applications_sorting(recruiter_client: AsyncClient):
    """Testa se as candidaturas são retornadas ordenadas por score."""
    # 1. Cria vaga
    job_res = await recruiter_client.post(
        "/api/v1/jobs",
        json={
            "title": "Sorting Test",
            "area": "TI",
            "questions": [{"text": f"Q{i}", "options": ["A", "B"], "correct_index": 0} for i in range(5)]
        }
    )
    job_id = job_res.json()["id"]
    
    # 2. Envia candidatos com scores diferentes (80 e 100)
    for score in [80, 100]:
        email = f"score_{score}_{uuid.uuid4()}@test.com"
        profile = {"full_name": f"Tester {score}", "phone": "1", "email": email}
        data = {"job_id": job_id, "candidate_email": email, "profile_data": json.dumps(profile), "score": score}
        files = {"file": ("test.pdf", b"%PDF-1.4", "application/pdf")}
        await recruiter_client.post("/api/v1/applications/submit", data=data, files=files)
        
    # 3. Busca lista
    resp = await recruiter_client.get(f"/api/v1/recruiter/jobs/{job_id}/applications")
    apps = resp.json()
    assert apps[0]["score"] == 100
    assert apps[1]["score"] == 80

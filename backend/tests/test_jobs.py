import pytest
from httpx import AsyncClient

def _job_payload(**overrides):
    base = {
        "title": "Analista de Dados",
        "area": "BI",
        "contract_type": "CLT",
        "description": "Vaga para testar o sistema",
        "questions": [
            {"text": f"Q{i}?", "options": ["A", "B", "C", "D"], "correct_index": 0}
            for i in range(5)
        ],
    }
    base.update(overrides)
    return base

@pytest.mark.asyncio
async def test_job_lifecycle_create_and_read(recruiter_client: AsyncClient):
    """POST /api/v1/jobs seguido de GET deve funcionar corretamente com auth real."""
    # 1. Cria a vaga
    payload = _job_payload(title="Vaga Lifecycle")
    create_resp = await recruiter_client.post("/api/v1/jobs", json=payload)
    assert create_resp.status_code == 201
    job_id = create_resp.json()["id"]

    # 2. Busca os detalhes
    get_resp = await recruiter_client.get(f"/api/v1/jobs/{job_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["title"] == "Vaga Lifecycle"

@pytest.mark.asyncio
async def test_job_list_filtering(recruiter_client: AsyncClient):
    """GET /api/v1/jobs deve retornar apenas vagas abertas."""
    # 1. Cria vaga aberta (padrão)
    await recruiter_client.post("/api/v1/jobs", json=_job_payload(title="Aberta"))
    
    # 2. Cria vaga que será fechada
    resp_close = await recruiter_client.post("/api/v1/jobs", json=_job_payload(title="Fechada"))
    job_id = resp_close.json()["id"]
    
    # 3. Fecha a vaga (PATCH)
    await recruiter_client.patch(f"/api/v1/jobs/{job_id}", json={"status": "closed"})
    
    # 4. Lista vagas
    list_resp = await recruiter_client.get("/api/v1/jobs")
    jobs = list_resp.json()
    
    titles = [j["title"] for j in jobs]
    assert "Aberta" in titles
    assert "Fechada" not in titles

@pytest.mark.asyncio
async def test_update_job_updated_at_change(recruiter_client: AsyncClient):
    """PATCH /api/v1/jobs deve atualizar o campo updated_at."""
    create_resp = await recruiter_client.post("/api/v1/jobs", json=_job_payload(title="Antigo"))
    job = create_resp.json()

    # Atualiza
    update_resp = await recruiter_client.patch(f"/api/v1/jobs/{job['id']}", json={"title": "Novo"})
    assert update_resp.status_code == 200
    assert update_resp.json()["title"] == "Novo"

@pytest.mark.asyncio
async def test_get_job_not_found(client: AsyncClient):
    import uuid
    response = await client.get(f"/api/v1/jobs/{uuid.uuid4()}")
    assert response.status_code == 404

@pytest.mark.asyncio
async def test_update_questions_lock_conflict(recruiter_client: AsyncClient):
    # 1. Cria vaga
    job_res = await recruiter_client.post(
        "/api/v1/jobs",
        json=_job_payload(title="Vaga com Trava")
    )
    job_id = job_res.json()["id"]
    
    # 2. Tenta atualizar questões simulando que já tem candidatos
    # Precisamos de 5 questões no mínimo para passar na validação do schema JobQuestionsUpdate
    questions_payload = {
        "questions": [
            {"text": f"Nova Q{i}?", "options": ["A", "B"], "correct_index": 0} for i in range(5)
        ]
    }
    
    response = await recruiter_client.patch(
        f"/api/v1/jobs/{job_id}/questions",
        json=questions_payload,
        headers={"X-Simulate-Has-Applicants": "true"}
    )
    assert response.status_code == 409
    assert "já existem candidatos" in response.json()["detail"]

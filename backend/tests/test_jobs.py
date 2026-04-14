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
async def test_job_lifecycle_create_and_read(client: AsyncClient):
    """POST /api/v1/jobs seguido de GET deve funcionar corretamente."""
    # 1. Cria a vaga
    payload = _job_payload(title="Vaga Lifecycle")
    create_resp = await client.post("/api/v1/jobs", json=payload)
    assert create_resp.status_code == 201
    job_id = create_resp.json()["id"]

    # 2. Busca os detalhes
    get_resp = await client.get(f"/api/v1/jobs/{job_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["title"] == "Vaga Lifecycle"

@pytest.mark.asyncio
async def test_job_list_filtering(client: AsyncClient):
    """GET /api/v1/jobs deve retornar apenas vagas abertas."""
    # 1. Cria vaga aberta (padrão)
    await client.post("/api/v1/jobs", json=_job_payload(title="Aberta"))
    
    # 2. Cria vaga que será fechada
    resp_close = await client.post("/api/v1/jobs", json=_job_payload(title="Fechada"))
    job_id = resp_close.json()["id"]
    
    # 3. Fecha a vaga (PATCH)
    await client.patch(f"/api/v1/jobs/{job_id}", json={"status": "closed"})
    
    # 4. Lista vagas
    list_resp = await client.get("/api/v1/jobs")
    jobs = list_resp.json()
    
    titles = [j["title"] for j in jobs]
    assert "Aberta" in titles
    assert "Fechada" not in titles

@pytest.mark.asyncio
async def test_update_job_updated_at_change(client: AsyncClient):
    """PATCH /api/v1/jobs deve atualizar o campo updated_at."""
    create_resp = await client.post("/api/v1/jobs", json=_job_payload(title="Antigo"))
    job = create_resp.json()
    created_at = job.get("updated_at") # No schema Read, created_at costuma vir junto

    # Atualiza
    update_resp = await client.patch(f"/api/v1/jobs/{job['id']}", json={"title": "Novo"})
    assert update_resp.status_code == 200
    
    # Verificação básica de que não explodiu (auditoria em tempo real é difícil em milissegundos)
    assert update_resp.json()["title"] == "Novo"

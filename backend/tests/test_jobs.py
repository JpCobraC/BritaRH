"""
Testes das rotas de vagas (jobs) — vacancy-management spec.

Cobre criação, listagem e edição de vagas.
Banco de dados mockado via override de dependência no conftest.
Estado TDD: RED — vão falhar até que as rotas e modelos existam.
"""

import pytest
from unittest.mock import AsyncMock, MagicMock


# ─── Helpers ──────────────────────────────────────────────────────────────────

def _job_payload(**overrides) -> dict:
    """Payload mínimo válido para criação de uma vaga."""
    base = {
        "title": "Operador de Britagem",
        "area": "Operações",
        "contract_type": "CLT",
        "schedule": "Segunda a Sexta, 07h–16h",
        "workplace": "Planta Areia Branca – RN",
        "requirements": "Experiência mínima de 1 ano em operação de britagem.",
        "assignments": "Operar e monitorar britador primário e secundário.",
        "questions": [
            {
                "text": f"Questão {i}?",
                "options": ["A", "B", "C", "D"],
                "correct_index": 0,
            }
            for i in range(1, 6)  # mínimo 5 questões
        ],
    }
    base.update(overrides)
    return base


# ─── Criação de vagas ──────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_create_job_returns_201(client):
    """POST /api/v1/jobs deve retornar 201 Created com payload válido."""
    response = await client.post("/api/v1/jobs", json=_job_payload())
    assert response.status_code == 201


@pytest.mark.asyncio
async def test_create_job_returns_job_id(client):
    """POST /api/v1/jobs deve retornar o id da vaga criada."""
    response = await client.post("/api/v1/jobs", json=_job_payload())
    data = response.json()
    assert "id" in data
    assert data["id"] is not None


@pytest.mark.asyncio
async def test_create_job_persists_all_fields(client):
    """POST /api/v1/jobs deve persistir todos os campos obrigatórios."""
    payload = _job_payload()
    response = await client.post("/api/v1/jobs", json=payload)
    data = response.json()
    assert data["title"] == payload["title"]
    assert data["area"] == payload["area"]
    assert data["contract_type"] == payload["contract_type"]
    assert data["status"] == "open"  # vaga começa aberta


@pytest.mark.asyncio
async def test_create_job_missing_title_returns_422(client):
    """POST /api/v1/jobs sem título deve retornar 422 Unprocessable Entity."""
    payload = _job_payload()
    del payload["title"]
    response = await client.post("/api/v1/jobs", json=payload)
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_create_job_missing_area_returns_422(client):
    """POST /api/v1/jobs sem área deve retornar 422."""
    payload = _job_payload()
    del payload["area"]
    response = await client.post("/api/v1/jobs", json=payload)
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_create_job_fewer_than_5_questions_returns_422(client):
    """POST /api/v1/jobs com menos de 5 questões deve retornar 422."""
    payload = _job_payload()
    payload["questions"] = payload["questions"][:4]  # apenas 4 questões
    response = await client.post("/api/v1/jobs", json=payload)
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_create_job_more_than_20_questions_returns_422(client):
    """POST /api/v1/jobs com mais de 20 questões deve retornar 422."""
    payload = _job_payload()
    payload["questions"] = [
        {"text": f"Q{i}?", "options": ["A", "B", "C", "D"], "correct_index": 0}
        for i in range(21)
    ]
    response = await client.post("/api/v1/jobs", json=payload)
    assert response.status_code == 422


# ─── Listagem de vagas ─────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_list_jobs_returns_200(client):
    """GET /api/v1/jobs deve retornar 200 OK."""
    response = await client.get("/api/v1/jobs")
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_list_jobs_returns_list(client):
    """GET /api/v1/jobs deve retornar uma lista."""
    response = await client.get("/api/v1/jobs")
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_list_jobs_only_shows_open(client):
    """GET /api/v1/jobs deve retornar apenas vagas com status 'open'."""
    response = await client.get("/api/v1/jobs")
    jobs = response.json()
    for job in jobs:
        assert job["status"] == "open"


# ─── Edição de vagas ───────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_update_job_without_applicants_returns_200(client):
    """PATCH /api/v1/jobs/{id} sem candidatos deve retornar 200 OK."""
    # Cria a vaga
    create_resp = await client.post("/api/v1/jobs", json=_job_payload())
    job_id = create_resp.json()["id"]

    # Edita — sem candidatos, todos os campos devem ser editáveis
    update_resp = await client.patch(
        f"/api/v1/jobs/{job_id}",
        json={"title": "Operador de Britagem Sr."},
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["title"] == "Operador de Britagem Sr."


@pytest.mark.asyncio
async def test_update_job_questions_blocked_when_has_applicants(client):
    """PATCH /api/v1/jobs/{id}/questions deve retornar 409 se houver candidatos."""
    # Cria a vaga
    create_resp = await client.post("/api/v1/jobs", json=_job_payload())
    job_id = create_resp.json()["id"]

    # Simula que há candidatos (endpoint futuro — por ora testa a regra de negócio)
    update_resp = await client.patch(
        f"/api/v1/jobs/{job_id}/questions",
        json={"questions": _job_payload()["questions"]},
        headers={"X-Simulate-Has-Applicants": "true"},  # header de teste
    )
    assert update_resp.status_code == 409


@pytest.mark.asyncio
async def test_update_nonexistent_job_returns_404(client):
    """PATCH /api/v1/jobs/nonexistent deve retornar 404 Not Found."""
    response = await client.patch(
        "/api/v1/jobs/00000000-0000-0000-0000-000000000000",
        json={"title": "Qualquer Título"},
    )
    assert response.status_code == 404


# ─── Painel do recrutador ──────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_recruiter_dashboard_lists_all_jobs(client):
    """GET /api/v1/recruiter/jobs deve retornar todas as vagas do recrutador (abertas e fechadas)."""
    response = await client.get("/api/v1/recruiter/jobs")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    # Cada vaga deve ter os campos do painel
    for job in data:
        assert "id" in job
        assert "title" in job
        assert "status" in job
        assert "applicant_count" in job

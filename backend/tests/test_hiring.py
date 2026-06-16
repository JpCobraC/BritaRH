import uuid
import json
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.models import Application, Job

def _job_payload():
    return {
        "title": "Operador de Britagem",
        "area": "Operações",
        "description": "Vaga para testar contratação",
        "questions": [
            {"text": "Questão 1", "options": ["A", "B", "C", "D"], "correct_index": 0},
            {"text": "Questão 2", "options": ["A", "B", "C", "D"], "correct_index": 0},
            {"text": "Questão 3", "options": ["A", "B", "C", "D"], "correct_index": 0},
            {"text": "Questão 4", "options": ["A", "B", "C", "D"], "correct_index": 0},
            {"text": "Questão 5", "options": ["A", "B", "C", "D"], "correct_index": 0},
        ]
    }

@pytest.mark.asyncio
async def test_hire_candidate_success(recruiter_client: AsyncClient, db_session: AsyncSession):
    """POST /api/v1/jobs/{job_id}/hire deve fechar a vaga e excluir candidaturas e currículos."""
    # 1. Cria uma vaga
    job_resp = await recruiter_client.post("/api/v1/jobs", json=_job_payload())
    assert job_resp.status_code == 201
    job_id = job_resp.json()["id"]

    # 2. Submete uma candidatura
    email = "candidato_hired@test.com"
    profile_data = {"full_name": "Candidato Contratado", "email": email, "phone": "(31) 99999-9999", "cidade": "BH", "experiencia": "1 a 3 anos"}
    data = {
        "job_id": job_id,
        "candidate_email": email,
        "profile_data": json.dumps(profile_data),
        "score": 85
    }
    files = {"file": ("curriculo.pdf", b"%PDF-1.4 content", "application/pdf")}

    resp_submit = await recruiter_client.post("/api/v1/applications/submit", data=data, files=files)
    assert resp_submit.status_code == 200

    # 3. Executa a contratação
    hire_resp = await recruiter_client.post(
        f"/api/v1/jobs/{job_id}/hire?candidate_email={email}"
    )
    assert hire_resp.status_code == 200
    assert hire_resp.json()["status"] == "success"

    # 4. Verifica no banco se a vaga está fechada (status == closed)
    stmt_job = select(Job).where(Job.id == uuid.UUID(job_id))
    result_job = await db_session.execute(stmt_job)
    job_db = result_job.scalar_one()
    assert job_db.status == "closed"

    # 5. Verifica se as candidaturas para essa vaga foram excluídas
    stmt_apps = select(Application).where(Application.job_id == uuid.UUID(job_id))
    result_apps = await db_session.execute(stmt_apps)
    apps_db = result_apps.scalars().all()
    assert len(apps_db) == 0


@pytest.mark.asyncio
async def test_hire_candidate_unauthorized(client: AsyncClient):
    """POST /api/v1/jobs/{job_id}/hire por cliente não autenticado/recrutador deve retornar 401/403."""
    job_id = str(uuid.uuid4())
    hire_resp = await client.post(
        f"/api/v1/jobs/{job_id}/hire?candidate_email=test@test.com"
    )
    assert hire_resp.status_code in (401, 403)


@pytest.mark.asyncio
async def test_hire_candidate_not_found(recruiter_client: AsyncClient):
    """POST /api/v1/jobs/{job_id}/hire para vaga inexistente deve retornar erro 400."""
    job_id = str(uuid.uuid4())
    hire_resp = await recruiter_client.post(
        f"/api/v1/jobs/{job_id}/hire?candidate_email=test@test.com"
    )
    assert hire_resp.status_code == 400
    assert "Vaga não encontrada" in hire_resp.json()["detail"]

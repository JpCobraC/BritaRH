import uuid
import json
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.models import Application, User

def _job_payload():
    return {
        "title": "Desenvolvedor Full Stack",
        "area": "TI",
        "description": "Vaga para testes",
        "questions": [
            {"text": "Q1", "options": ["A", "B", "C", "D"], "correct_index": 0},
            {"text": "Q2", "options": ["A", "B", "C", "D"], "correct_index": 0},
            {"text": "Q3", "options": ["A", "B", "C", "D"], "correct_index": 0},
            {"text": "Q4", "options": ["A", "B", "C", "D"], "correct_index": 0},
            {"text": "Q5", "options": ["A", "B", "C", "D"], "correct_index": 0},
        ]
    }

@pytest.mark.asyncio
async def test_submit_application_with_user_linkage(recruiter_client: AsyncClient, db_session: AsyncSession):
    """POST /api/v1/applications/submit deve vincular user_id se o email já for de um usuário."""
    import uuid
    # 1. Cria um usuário prévio com e-mail único
    email = f"registered_{uuid.uuid4()}@user.com"
    registered_user = User(email=email, name="Registered User", role="candidate", cpf=str(uuid.uuid4().int)[:11])
    db_session.add(registered_user)
    await db_session.commit()

    # 2. Cria uma vaga usando recruiter_client
    job_resp = await recruiter_client.post("/api/v1/jobs", json=_job_payload())
    job_id = job_resp.json()["id"]

    # 3. Submete candidatura com o mesmo e-mail (não precisa de auth)
    profile_data = {"full_name": "Applicant Name", "email": email, "phone": "123"}
    data = {
        "job_id": job_id, "candidate_email": email,
        "profile_data": json.dumps(profile_data), "score": 90
    }
    files = {"file": ("resume.pdf", b"%PDF-1.4 content", "application/pdf")}

    resp = await recruiter_client.post("/api/v1/applications/submit", data=data, files=files)
    assert resp.status_code == 200
    
    # 4. Verifica no banco se o user_id foi vinculado
    app_id = resp.json()["id"]
    stmt = select(Application).where(Application.id == uuid.UUID(app_id))
    result = await db_session.execute(stmt)
    app_db = result.scalar_one()
    
    assert app_db.user_id == registered_user.id
    assert app_db.candidate_email == email

@pytest.mark.asyncio
async def test_submit_application_duplicate_prevention(recruiter_client: AsyncClient):
    """Garante bloqueio de múltiplas candidaturas do mesmo e-mail para a mesma vaga."""
    import uuid
    job_resp = await recruiter_client.post("/api/v1/jobs", json=_job_payload())
    job_id = job_resp.json()["id"]
    email = f"one-timer_{uuid.uuid4()}@test.com"

    valid_profile = {"full_name": "One Timer", "email": email, "phone": "999"}
    data = {
        "job_id": job_id, "candidate_email": email,
        "profile_data": json.dumps(valid_profile), "score": 10
    }
    files = {"file": ("1.pdf", b"%PDF-1.4 content", "application/pdf")}

    # Primeira OK
    r1 = await recruiter_client.post("/api/v1/applications/submit", data=data, files=files)
    assert r1.status_code == 200

    # Segunda FALHA
    r2 = await recruiter_client.post("/api/v1/applications/submit", data=data, files=files)
    assert r2.status_code == 409
    assert "Você já se candidatou" in r2.json()["detail"]

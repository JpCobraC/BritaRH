import pytest
import uuid
from httpx import AsyncClient
from datetime import date, timedelta

@pytest.mark.asyncio
async def test_register_duplicate_email(client: AsyncClient):
    # Primeiro registro
    unique_email = f"dup_{uuid.uuid4()}@example.com"
    user_data = {
        "email": unique_email,
        "password": "password123",
        "name": "User One",
        "cpf": str(uuid.uuid4().int)[:11],
        "birth_date": "1990-01-01",
        "role": "candidate"
    }
    await client.post("/api/v1/auth/register", json=user_data)
    
    # Segundo registro com mesmo e-mail
    response = await client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == 400
    assert response.json()["detail"] == "E-mail já cadastrado."

@pytest.mark.asyncio
async def test_register_underage(client: AsyncClient):
    # Usuário com 13 anos
    birth_date = (date.today() - timedelta(days=13*365)).isoformat()
    user_data = {
        "email": f"kid_{uuid.uuid4()}@example.com",
        "password": "password123",
        "name": "Kid",
        "cpf": str(uuid.uuid4().int)[:11],
        "birth_date": birth_date,
        "role": "candidate"
    }
    response = await client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == 400
    assert "idade mínima" in response.json()["detail"].lower()

@pytest.mark.asyncio
async def test_login_invalid_credentials(client: AsyncClient):
    # Tentar logar com usuário que não existe
    response = await client.post("/api/v1/auth/login", json={
        "email": f"nonexistent_{uuid.uuid4()}@example.com",
        "password": "wrong"
    })
    assert response.status_code == 401
    
    # Criar usuário e errar a senha
    email = f"valid_{uuid.uuid4()}@example.com"
    await client.post("/api/v1/auth/register", json={
        "email": email,
        "password": "correctpassword",
        "name": "Valid User",
        "cpf": str(uuid.uuid4().int)[:11],
        "birth_date": "1990-01-01"
    })
    
    response = await client.post("/api/v1/auth/login", json={
        "email": email,
        "password": "wrongpassword"
    })
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_protected_route_token_missing(client: AsyncClient):
    # Rota de recrutador sem header - FastAPI Security retorna 403 por padrão se o provider falha
    # Usamos uma rota que sabemos que existe
    response = await client.get("/api/v1/recruiter/jobs")
    # Nota: No FastAPI, se não houver um override e o token estiver ausente, 
    # o HTTPBearer levanta uma exceção que resulta em 403 ou 401 dependendo da config.
    # Vamos aceitar ambos para evitar fragilidade, focando na cobertura.
    assert response.status_code in [401, 403]

@pytest.mark.asyncio
async def test_protected_route_invalid_token(client: AsyncClient):
    # Rota com token mal-formado
    response = await client.get(
        "/api/v1/recruiter/jobs", 
        headers={"Authorization": "Bearer invalid-junk"}
    )
    assert response.status_code == 401

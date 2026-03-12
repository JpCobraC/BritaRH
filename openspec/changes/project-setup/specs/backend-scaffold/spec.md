## ADDED Requirements

### Requirement: Scaffold do backend FastAPI
O backend SHALL ter estrutura modular: `app/api/v1/`, `app/core/`, `app/models/`, `app/schemas/`, `app/services/`, `alembic/`, `tests/`.
O endpoint `GET /api/v1/health` SHALL retornar `{"status": "ok"}`.
SQLAlchemy async SHALL estar configurado com engine e session factory.
Alembic SHALL estar configurado pronto para gerar migrations.
`pyproject.toml` SHALL listar todas as dependências (fastapi, sqlalchemy, alembic, pydantic, uvicorn, python-multipart, boto3, python-jose).

#### Scenario: Health check responde
- **WHEN** o desenvolvedor acessa `GET http://localhost:8000/api/v1/health`
- **THEN** o backend retorna `{"status": "ok"}` com HTTP 200

#### Scenario: Alembic conecta ao banco
- **WHEN** o desenvolvedor executa `alembic upgrade head` dentro do container
- **THEN** o comando conclui sem erros (banco vazio sem migrations ainda)

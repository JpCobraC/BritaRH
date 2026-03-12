## ADDED Requirements

### Requirement: Docker Compose com 4 serviços
O `docker-compose.yml` SHALL definir os serviços: `db` (PostgreSQL 16), `storage` (MinIO), `backend` (FastAPI), `frontend` (Next.js).
Os serviços SHALL se comunicar via rede interna Docker.
O backend SHALL depender do `db` estar healthy antes de iniciar.
Ports expostos: `5432` (db), `9000/9001` (storage), `8000` (backend), `3000` (frontend).

#### Scenario: Ambiente de desenvolvimento sobe corretamente
- **WHEN** o desenvolvedor executa `docker compose up --build`
- **THEN** todos os 4 serviços iniciam sem erros e ficam disponíveis nas portas definidas

#### Scenario: Hot reload no desenvolvimento
- **WHEN** o desenvolvedor edita um arquivo Python ou TypeScript
- **THEN** o serviço correspondente recarrega automaticamente (uvicorn --reload / turbopack)

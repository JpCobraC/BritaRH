## Context

Projeto novo — repositório BritaRH no GitHub. Nenhuma estrutura de código existe ainda. Este change cria o esqueleto completo do monorepo conforme a stack definida.

**Stack:**
- Backend: Python 3.12+, FastAPI, SQLAlchemy async, Alembic, PostgreSQL 16
- Frontend: TypeScript, Next.js 14+ (App Router), NextAuth.js v5
- Storage: MinIO (dev) com interface S3-compatible
- DevOps: Docker Compose, GitHub Actions

## Goals / Non-Goals

**Goals:**
- Estrutura de monorepo com `backend/`, `frontend/`, `infra/`, `.github/`
- `docker-compose.yml` funcional com os 4 serviços
- Backend FastAPI com estrutura modular, Alembic configurado, health check em `/api/v1/health`
- Frontend Next.js com NextAuth.js configurado para Google OAuth
- Arquivo `.env.example` com todas as variáveis necessárias
- GitHub Actions: lint (ruff + mypy para Python, eslint + tsc para TS) + testes básicos

**Non-Goals:**
- Implementação de features (vagas, candidatos, etc.)
- Deploy em produção (cloud)
- Testes E2E

## Decisions

### Decision 1: Monorepo simples (sem Turborepo/nx)
Pasta raiz com `backend/` e `frontend/` como projetos independentes. Docker Compose orquestra tudo.

**Razão:** Sem dependências cruzadas de código entre os projetos; complexidade de monorepo tool não é justificada agora.

### Decision 2: Estrutura modular do FastAPI
```
backend/
  app/
    api/v1/          ← routers por domínio (jobs, auth, applications)
    core/            ← config, security, database
    models/          ← SQLAlchemy models
    schemas/         ← Pydantic schemas
    services/        ← lógica de negócio
  alembic/           ← migrations
  tests/
  Dockerfile
  pyproject.toml
```

### Decision 3: NextAuth.js v5 com adapter de banco
NextAuth.js configurado com Google Provider. Sessão gerenciada via JWT (stateless). O backend valida o JWT via shared secret.

### Decision 4: Variáveis de ambiente por serviço
Cada serviço lê seu próprio bloco de variáveis. Um único `.env` na raiz com prefixos:
- `POSTGRES_*`, `MINIO_*`, `NEXTAUTH_*`, `GOOGLE_*`, `BACKEND_*`

## Estrutura Docker Compose

```yaml
services:
  db:       postgres:16-alpine   — porta 5432
  storage:  minio/minio          — porta 9000 (API) + 9001 (console)
  backend:  build ./backend      — porta 8000
  frontend: build ./frontend     — porta 3000
```

## Risks / Trade-offs

- **[Risco] CORS mal configurado** → Mitigação: `CORS_ORIGINS` no FastAPI via env, restrito ao domínio do frontend
- **[Trade-off] JWT sem revogação** → tokens com TTL curto (15min) + refresh token em httpOnly cookie

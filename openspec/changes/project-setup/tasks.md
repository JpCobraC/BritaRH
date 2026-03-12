## 1. Estrutura do Monorepo

- [ ] 1.1 Criar pastas raiz: `backend/`, `frontend/`, `infra/`, `.github/workflows/`
- [ ] 1.2 Criar `README.md` na raiz com instruções de setup local
- [ ] 1.3 Criar `.env.example` com todas as variáveis (POSTGRES_*, MINIO_*, GOOGLE_*, NEXTAUTH_*, BACKEND_*)
- [ ] 1.4 Criar `.gitignore` cobrindo Python, Node.js e arquivos `.env`

## 2. Docker Compose

- [ ] 2.1 Criar `docker-compose.yml` com serviços: `db` (postgres:16-alpine), `storage` (minio/minio), `backend`, `frontend`
- [ ] 2.2 Configurar healthcheck no serviço `db` e dependência `backend depends_on db`
- [ ] 2.3 Configurar volumes persistentes para `db` e `storage`
- [ ] 2.4 Configurar bind mounts para hot reload: `backend/` e `frontend/src`
- [ ] 2.5 Testar `docker compose up --build` e validar que os 4 serviços sobem

## 3. Backend FastAPI

- [ ] 3.1 Criar `backend/pyproject.toml` com dependências: fastapi, uvicorn, sqlalchemy[asyncio], alembic, asyncpg, pydantic-settings, python-multipart, boto3, python-jose[cryptography], ruff, mypy
- [ ] 3.2 Criar estrutura de módulos: `app/api/v1/`, `app/core/`, `app/models/`, `app/schemas/`, `app/services/`
- [ ] 3.3 Criar `app/core/config.py` com Settings (pydantic-settings lendo .env)
- [ ] 3.4 Criar `app/core/database.py` com engine async e session factory
- [ ] 3.5 Criar `app/main.py` com FastAPI app, CORS middleware e router `/api/v1/`
- [ ] 3.6 Implementar endpoint `GET /api/v1/health` retornando `{"status": "ok"}`
- [ ] 3.7 Configurar Alembic (`alembic init alembic`) e ajustar `alembic.ini` + `env.py` para usar a URL do banco via env
- [ ] 3.8 Criar `backend/Dockerfile` com imagem Python 3.12-slim, uvicorn com --reload em dev
- [ ] 3.9 Validar: `GET http://localhost:8000/api/v1/health` retorna 200

## 4. Frontend Next.js

- [ ] 4.1 Criar projeto Next.js: `npx create-next-app@latest frontend --typescript --app --no-tailwind`
- [ ] 4.2 Instalar NextAuth.js v5: `npm install next-auth@beta`
- [ ] 4.3 Criar `auth.ts` com NextAuth configurado para Google Provider
- [ ] 4.4 Criar `app/api/auth/[...nextauth]/route.ts`
- [ ] 4.5 Criar página de login `app/page.tsx` com botão "Entrar com Google"
- [ ] 4.6 Criar `frontend/Dockerfile` com Node 20-alpine, modo dev com turbopack
- [ ] 4.7 Validar: `http://localhost:3000` abre a página de login sem erros

## 5. CI/CD GitHub Actions

- [ ] 5.1 Criar `.github/workflows/backend.yml`: instala deps, roda `ruff check` + `mypy` + `pytest`
- [ ] 5.2 Criar `.github/workflows/frontend.yml`: instala deps, roda `eslint` + `tsc --noEmit`
- [ ] 5.3 Configurar branch protection em `main` exigindo os dois checks passados para merge

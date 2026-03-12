## Why

O projeto BritaRH não possui estrutura de código ainda. Antes de implementar qualquer feature, é necessário criar o repositório monorepo, configurar os serviços via Docker Compose (backend FastAPI, frontend Next.js, PostgreSQL, MinIO para storage), e estabelecer o pipeline de CI/CD com GitHub Actions.

## What Changes

- Criar estrutura de pastas do monorepo (`backend/`, `frontend/`, `infra/`)
- Configurar `docker-compose.yml` com os 4 serviços: `db`, `storage`, `backend`, `frontend`
- Scaffoldar backend FastAPI com estrutura de projeto, Alembic para migrations e configuração de variáveis de ambiente
- Scaffoldar frontend Next.js 14+ com TypeScript, estrutura App Router e NextAuth.js configurado
- Criar pipeline GitHub Actions: lint + testes no push/PR

## Capabilities

### New Capabilities

- `monorepo-structure`: Estrutura de pastas e arquivos de configuração base do projeto
- `docker-compose-setup`: Configuração dos 4 containers (db, storage, backend, frontend) com networking e volumes
- `backend-scaffold`: FastAPI app com estrutura de módulos, Alembic, SQLAlchemy async, variáveis de ambiente
- `frontend-scaffold`: Next.js 14 com TypeScript, App Router, NextAuth.js (Google OAuth), configuração base
- `ci-pipeline`: GitHub Actions para lint, type-check e testes automatizados

### Modified Capabilities

_(nenhuma — este change cria a base do projeto do zero)_

## Impact

- **Pré-requisito** para todos os outros changes (`candidate-recruitment-flow`, `vacancy-management`)
- Cria as convenções de código e estrutura que os outros changes seguirão
- Define variáveis de ambiente necessárias (`.env.example`)

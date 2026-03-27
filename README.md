# BritaRH

O **BritaRH** é o sistema de recrutamento e seleção da **Britasul**, desenvolvido para facilitar o processo de candidatura a vagas da empresa. A plataforma permite que candidatos visualizem oportunidades disponíveis, realizem um teste inicial e enviem seu currículo de forma simples e rápida.

## 🚀 Funcionalidades

- **Visualização de vagas** — Lista com todas as vagas disponíveis, cargo, requisitos e descrição.
- **Candidatura online** — O candidato se candidata diretamente pelo sistema.
- **Teste inicial** — Questionário com perguntas configuráveis que avalia o perfil do candidato.
- **Envio de currículo** — Área para anexar currículo em formato PDF ou DOC/DOCX.

## 📋 Fluxo de candidatura

1. Candidato acessa a plataforma e autentica-se com Google.
2. Visualiza as **vagas disponíveis** e seleciona uma.
3. Preenche o **perfil** (passo 1).
4. Realiza o **teste** da vaga (passo 2).
5. Envia o **currículo** (passo 3).
6. Recebe confirmação; RH acessa o painel com candidaturas.

## 🛠️ Setup Local (Desenvolvimento)

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) ≥ 24
- [Docker Compose](https://docs.docker.com/compose/) ≥ 2.20
- Git

### 1. Clonar o repositório

```bash
git clone https://github.com/JpCobraC/BritaRH.git
cd BritaRH
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
# Edite .env: preencha GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET e NEXTAUTH_SECRET
```

### 3. Subir todos os serviços

```bash
docker compose up --build
```

### 4. URLs dos serviços

| Serviço       | URL                         |
|---------------|-----------------------------|
| Frontend      | http://localhost:3000       |
| Backend API   | http://localhost:8000/docs  |
| MinIO Console | http://localhost:9001       |
| PostgreSQL    | localhost:5432              |

### 5. Rodar testes

```bash
# Backend
cd backend && pip install -e ".[dev]" && pytest

# Frontend
cd frontend && npm install && npm test
```

## 📁 Estrutura do monorepo

```
BritaRH/
├── backend/         ← FastAPI + SQLAlchemy async + Alembic
│   ├── app/
│   │   ├── api/v1/  ← routers por domínio
│   │   ├── core/    ← config, database, security
│   │   ├── models/  ← SQLAlchemy models
│   │   ├── schemas/ ← Pydantic schemas
│   │   └── services/← lógica de negócio
│   ├── alembic/
│   ├── tests/
│   └── Dockerfile
├── frontend/        ← Next.js 14 (App Router) + NextAuth.js v5
│   ├── app/
│   ├── components/
│   └── Dockerfile
├── infra/           ← Configurações de infraestrutura
├── .github/
│   └── workflows/   ← CI/CD GitHub Actions
├── docker-compose.yml
└── .env.example
```

## 🏢 Sobre a Britasul

A **Britasul** utiliza o BritaRH para modernizar e organizar seu processo de recrutamento, tornando a seleção de talentos mais ágil, transparente e eficiente.

---

**BritaRH — Sistema de Recrutamento da Britasul**
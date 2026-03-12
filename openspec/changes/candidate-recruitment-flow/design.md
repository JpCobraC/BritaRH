## Context

O BritaRH é um sistema de recrutamento da Britasul com dois perfis: candidato e recrutador. O sistema precisa de autenticação Google OAuth, um fluxo guiado de candidatura (formulário + teste + upload) e um painel para o recrutador gerenciar candidatos por vaga.

**Stack definida:**
- Backend: Python 3.12+ + FastAPI + PostgreSQL (SQLAlchemy async + Alembic)
- Frontend: TypeScript + Next.js 14+ (App Router)
- Auth: NextAuth.js (Google OAuth) no frontend; backend valida JWT
- Storage: MinIO (dev) / S3-compatible (prod) para currículos em PDF
- DevOps: Docker + Docker Compose, GitHub Actions

## Goals / Non-Goals

**Goals:**
- Autenticação Google OAuth com roles: `candidate` e `recruiter`
- Fluxo de candidatura: formulário de perfil → teste → upload de currículo
- Armazenar candidaturas em PostgreSQL
- Armazenar currículos em storage S3-compatible
- Painel do recrutador: listar candidatos por vaga, ver score, contratar
- Ao contratar: fechar vaga e hard delete de todos os dados de candidatos + arquivos

**Non-Goals:**
- Notificações por e-mail
- Agendamento de entrevistas
- CRUD de recrutadores via UI (gerenciado via banco)

## Decisions

### Decision 1: Separação Backend / Frontend
Backend FastAPI expõe REST API em `/api/v1/`. Frontend Next.js consome a API via Server Actions ou fetch direto (dependendo da rota). Sem BFF extra.

**Razão:** Clareza de responsabilidades; o backend pode ser consumido por outros clientes no futuro.

### Decision 2: Autenticação — NextAuth.js + JWT
NextAuth.js gerencia o fluxo OAuth no frontend. Ao autenticar, o backend emite um JWT assinado com o role do usuário. Frontend anexa o JWT em todas as chamadas ao backend.

Recrutadores são identificados por uma tabela `recruiter_whitelist` no PostgreSQL (email + ativo).

**Alternativas consideradas:**
- Supabase Auth: descartado, a stack usa backend próprio
- Session cookies: menos adequado para API REST

### Decision 3: Storage de currículos com MinIO (dev) / S3 (prod)
Currículos são armazenados no storage S3-compatible. O backend gera URLs pré-assinadas para upload (frontend envia direto ao storage) e para download (recrutador visualiza/baixa).

**Razão:** Evita tráfego de arquivo pelo backend; presigned URLs são seguras e expiram.

### Decision 4: Hard delete ao contratar
Endpoint `/api/v1/jobs/{id}/hire` executa: marcar vaga como fechada, deletar todas as `applications`, deletar objetos do storage. Exige confirmação dupla no frontend.

## Risks / Trade-offs

- **[Risco] JWT sem revogação** → Mitigação: tokens com TTL curto (15min); refresh token armazenado em httpOnly cookie
- **[Risco] Upload direto ao storage exposto** → Mitigação: presigned URLs com expiração de 5min e escopo por path
- **[Risco] Exclusão irreversível** → Mitigação: confirmação dupla no frontend; log server-side da ação
- **[Trade-off] CORS entre Next.js e FastAPI** → configurar `CORS_ORIGINS` no FastAPI via env var

## Estrutura de Containers (Docker Compose)

```
services:
  db         → PostgreSQL 16
  storage    → MinIO (S3-compatible)
  backend    → FastAPI (uvicorn)
  frontend   → Next.js (dev: turbopack | prod: standalone)
```

## Context

Este change adiciona o gerenciamento de vagas ao painel do recrutador. A tabela `jobs` é criada aqui com todos os campos necessários, junto com a tabela `questions`. As telas de criação e edição de vagas ficam no frontend Next.js, consumindo a API FastAPI.

**Stack:** FastAPI + PostgreSQL + Next.js + Docker (ver design de `candidate-recruitment-flow` para detalhes completos de infraestrutura).

## Goals / Non-Goals

**Goals:**
- Endpoints FastAPI para criar, editar e listar vagas (com questões)
- Formulário Next.js de criação de vaga (campos descritivos + questões do teste)
- Edição de vaga com bloqueio de questões quando há candidatos
- Listagem de vagas no painel do recrutador com status e contagem de candidatos

**Non-Goals:**
- Aprovação de vagas por gestor
- Modo rascunho (draft) — ao salvar, vaga é publicada imediatamente
- Histórico de edições
- Duplicação de vagas

## Decisions

### Decision 1: Vagas e Questões em endpoints separados
- `POST /api/v1/jobs` → cria vaga + questões em uma transação
- `PUT /api/v1/jobs/{id}` → edita vaga; verifica se há candidatos antes de permitir edição de questões
- `GET /api/v1/jobs/{id}/questions` → retorna questões (candidatos) ou todas (recrutador)

**Razão:** Separar leitura de questões permite servir apenas as perguntas (sem gabarito) ao candidato.

### Decision 2: Validação de mínimo de questões no backend
O endpoint de criação/edição valida que há entre 5 e 20 questões antes de persistir. Frontend também valida, mas a fonte de verdade é o backend.

### Decision 3: Bloqueio de edição de questões via query
Antes de aceitar edição de questões, o backend faz `SELECT COUNT(*) FROM applications WHERE job_id = ?`. Se > 0, retorna 422 com mensagem clara. Frontend interpreta esse erro e exibe o estado bloqueado.

## Risks / Trade-offs

- **[Risco] Transação falha no meio (vaga salva, questões não)** → Mitigação: criar vaga + questões em uma única transação SQLAlchemy
- **[Trade-off] Sem rascunho** → aceito no MVP; vaga ativa imediatamente ao salvar

## Modelo de Dados

```sql
-- jobs
id           SERIAL PRIMARY KEY
title        VARCHAR(200) NOT NULL
area         VARCHAR(100) NOT NULL
contract_type VARCHAR(50) NOT NULL  -- CLT, PJ, Temporário
schedule     VARCHAR(100) NOT NULL  -- ex: "Segunda a Sexta, 08h-17h"
workplace    VARCHAR(200) NOT NULL
requirements TEXT NOT NULL
duties       TEXT NOT NULL
status       VARCHAR(20) DEFAULT 'open'  -- open | closed
created_by   INTEGER REFERENCES users(id)
created_at   TIMESTAMP DEFAULT NOW()

-- questions
id           SERIAL PRIMARY KEY
job_id       INTEGER REFERENCES jobs(id) ON DELETE CASCADE
text         TEXT NOT NULL
options      JSONB NOT NULL  -- ["opção A", "opção B", "opção C", "opção D"]
correct_index INTEGER NOT NULL  -- 0-3
order_index  INTEGER NOT NULL
```

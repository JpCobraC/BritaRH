# BritaRH

O **BritaRH** é o sistema de recrutamento e seleção da **Britasul**, desenvolvido para facilitar o processo de candidatura a vagas da empresa. A plataforma permite que candidatos visualizem oportunidades disponíveis, realizem um teste inicial e enviem seu currículo de forma simples e rápida.

## 🚀 Funcionalidades

- **Visualização de vagas** — Lista com todas as vagas disponíveis, cargo, requisitos e descrição.
- **Candidatura online** — O candidato se candidata diretamente pelo sistema.
- **Teste inicial** — Questionário com perguntas configuráveis que avalia o perfil do candidato.
- **Envio de currículo** — Área para anexar currículo em formato PDF ou DOC/DOCX.
- **Tema Escuro & Responsividade** — Suporte completo para modo claro e escuro (com botões de alternância rápida na tela de Login, no cabeçalho do Candidato e no menu do Recrutador) e interface adaptada para qualquer tamanho de tela.
- **Cadastro Completo via Google OAuth** — Fluxo automático de onboarding para que novos candidatos vindos do Google preencham CPF e data de nascimento no primeiro acesso.
- **Painel do Recrutador (Candidaturas)** — Visualização consolidada de vagas ativas/fechadas, contagem de inscritos e ranking de candidatos ordenados por desempenho no teste técnico.
- **Contratação de Candidatos** — Ação direta de contratação que automaticamente encerra a vaga, tornando-a invisível para novas candidaturas.
- **Conformidade LGPD & Exclusão Segura** — Mecanismo de privacidade que, mediante dupla confirmação no painel, remove permanentemente (hard delete) os dados de perfil dos outros concorrentes e apaga seus respectivos arquivos de currículo (PDF) do MinIO/Cloudflare R2 ao finalizar o processo.

## 📋 Fluxo de candidatura (Candidato)

1. Candidato acessa a plataforma e autentica-se com Google.
2. Caso seja um novo usuário, preenche os dados cadastrais obrigatórios faltantes.
3. Visualiza as **vagas disponíveis** e seleciona uma.
4. Preenche o **perfil** (passo 1).
5. Realiza o **teste** da vaga (passo 2).
6. Envia o **currículo** (passo 3).
7. Recebe confirmação por e-mail.

## 📋 Fluxo do Processo Seletivo (Recrutador)

1. Recrutador acessa o Painel de Controle e gerencia vagas.
2. Divulga oportunidades gerando links de candidatura rápidos via QRCode.
3. Acessa a aba **Candidaturas** no menu para listar os candidatos de cada vaga.
4. Realiza download de currículos, revisa perfis e envia e-mails de contato.
5. Seleciona o candidato ideal e clica em **Contratar**.
6. Confirma a contratação duas vezes no modal de segurança (dupla confirmação).
7. O sistema envia e-mail de contratação, fecha a vaga e executa a exclusão segura de todos os demais dados e arquivos do processo.

## 🛠️ Setup Local (Desenvolvimento)

### Pré-requisitos

- Docker ≥ 24
- Docker Compose ≥ 2.20
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
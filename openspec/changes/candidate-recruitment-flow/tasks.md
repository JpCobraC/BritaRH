## 1. Setup do Projeto

- [x] 1.1 Inicializar projeto Next.js (App Router) com TypeScript
- [x] 1.2 Configurar banco de dados local (PostgreSQL) e storage (MinIO)
- [x] 1.3 Configurar Google OAuth no Frontend (NextAuth.js v5)
- [x] 1.4 Instalar dependências básicas (jose, python-jose, etc.)

## 2. Banco de Dados

- [x] 2.1 Criar tabela `jobs` (id, title, area, description, status: open/closed)
- [x] 2.2 Criar tabela `applications` (id, job_id, candidate_email, profile_data JSON, score, message, resume_url, created_at)
- [x] 2.3 Criar tabela `questions` (id, job_id, text, options JSON, correct_index)
- [x] 2.4 Configurar Recruiter Whitelist e modelos relacionados

## 3. Autenticação

- [x] 3.1 Implementar página de login com botão "Entrar com Google"
- [x] 3.2 Implementar validação de JWT no Backend (segredo compartilhado)
- [ ] 3.3 Implementar middleware Next.js para proteger rotas (pendente refinamento)
- [x] 3.4 Configurar roles (candidate/recruiter) via whitelist no banco

## 4. Fluxo de Candidatura (Candidato)

- [ ] 4.1 Criar página de listagem de vagas abertas (exibir vagas do banco)
- [ ] 4.2 Implementar redirect para login se não autenticado
- [ ] 4.3 Criar formulário de perfil persistente
- [ ] ... (outras tarefas pendentes)

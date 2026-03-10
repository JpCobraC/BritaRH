## 1. Setup do Projeto

- [ ] 1.1 Inicializar projeto Next.js (App Router) com TypeScript
- [ ] 1.2 Configurar Supabase: criar projeto, banco de dados e storage bucket
- [ ] 1.3 Configurar Google OAuth no Supabase e definir whitelist de e-mails de recrutadores
- [ ] 1.4 Instalar dependências: `@supabase/supabase-js`, `@supabase/auth-helpers-nextjs`

## 2. Banco de Dados

- [ ] 2.1 Criar tabela `jobs` (id, title, area, description, status: open/closed)
- [ ] 2.2 Criar tabela `applications` (id, job_id, candidate_id, profile_data JSON, score, message, resume_path, created_at)
- [ ] 2.3 Criar tabela `questions` (id, job_id, text, options JSON, correct_index)
- [ ] 2.4 Configurar Row Level Security (RLS): candidatos só veem seus dados; recrutadores veem todos

## 3. Autenticação

- [ ] 3.1 Implementar página de login com botão "Entrar com Google"
- [ ] 3.2 Criar middleware Next.js para proteger rotas autenticadas
- [ ] 3.3 Implementar lógica de role (candidate/recruiter) via user_metadata
- [ ] 3.4 Criar rota de callback OAuth e redirect pós-login baseado no role

## 4. Fluxo de Candidatura (Candidato)

- [ ] 4.1 Criar página de listagem de vagas abertas com botão "Candidatar-se"
- [ ] 4.2 Implementar redirect para login se não autenticado, retornando à vaga após login
- [ ] 4.3 Criar formulário de perfil com campos: tempo na área, experiências, localização, disponibilidade, e-mail, telefone
- [ ] 4.4 Adicionar validação de campos obrigatórios e persistência no localStorage
- [ ] 4.5 Criar página do teste de área com questões carregadas do banco para a vaga
- [ ] 4.6 Implementar lógica de validação do teste (todas as questões obrigatórias) e cálculo de score
- [ ] 4.7 Criar página de upload de currículo (PDF, max 5MB) com validação de tipo/tamanho
- [ ] 4.8 Adicionar campo de mensagem opcional
- [ ] 4.9 Implementar submit final: salvar application no banco, fazer upload do PDF no Supabase Storage
- [ ] 4.10 Bloquear candidatura duplicada para a mesma vaga
- [ ] 4.11 Criar página de confirmação de candidatura enviada

## 5. Painel do Recrutador

- [ ] 5.1 Criar layout protegido para rotas de recrutador
- [ ] 5.2 Criar página de listagem de vagas ativas com número de candidatos
- [ ] 5.3 Criar página de candidatos por vaga com: nome, pontuação, link para currículo, mensagem
- [ ] 5.4 Implementar ordenação de candidatos por pontuação
- [ ] 5.5 Implementar download/visualização do PDF do currículo via Supabase Storage
- [ ] 5.6 Criar botão "Contratar" com confirmação dupla (modal + segundo clique)
- [ ] 5.7 Implementar fechamento de vaga: marcar vaga como closed, excluir applications e arquivos

## 6. Qualidade e Segurança

- [ ] 6.1 Validar MIME type do PDF no servidor (não confiar só no client)
- [ ] 6.2 Garantir que RLS do Supabase impede acesso cruzado entre candidatos
- [ ] 6.3 Testar fluxo completo: candidato → formulário → teste → upload → painel recrutador → contratação
- [ ] 6.4 Testar exclusão de dados ao fechar vaga (BD + Storage)

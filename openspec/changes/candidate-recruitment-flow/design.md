## Context

O BritaRH é um sistema de recrutamento da Britasul que atualmente permite visualização de vagas e envio de currículo sem estrutura. É necessário adicionar autenticação, um fluxo guiado de candidatura (formulário + teste + upload de currículo) e um painel para o recrutador gerenciar candidatos por vaga.

O sistema não possui backend persistente definido. Esta mudança estabelece a arquitetura base.

## Goals / Non-Goals

**Goals:**
- Autenticação Google OAuth com roles: `candidate` e `recruiter`
- Fluxo de candidatura: formulário de perfil → teste de área → upload de currículo + mensagem
- Armazenar candidaturas em banco de dados relacional
- Armazenar currículos em sistema de arquivos/storage
- Painel do recrutador: listar candidatos por vaga, ver score do teste, contratar
- Ao contratar: fechar vaga e excluir todos os dados de candidatos (hard delete)

**Non-Goals:**
- Notificações por e-mail para candidatos
- Sistema de agendamento de entrevistas
- Múltiplos recrutadores com permissões diferentes
- Questões do teste editáveis via UI (por ora, gerenciadas via banco)

## Decisions

### Decision 1: Stack — Next.js + Supabase
Utilizar Next.js (App Router) no frontend+backend e Supabase como banco de dados (PostgreSQL), auth via Google OAuth e storage para os currículos.

**Alternativas consideradas:**
- Backend separado (Node.js + Express): mais complexo de manter para um projeto de tamanho pequeno
- Firebase: menos controle sobre dados e SQL

**Razão:** Supabase oferece PostgreSQL + Auth + Storage em um só lugar, com integração Google OAuth nativa, ideal para o escopo do projeto.

### Decision 2: Roles via Supabase Auth metadata
Usar o campo `user_metadata` do Supabase Auth para definir o role (`candidate` | `recruiter`). Recrutadores serão cadastrados manualmente via dashboard do Supabase (whitelist de emails).

**Razão:** Simples de implementar, sem necessidade de UI de administração extra.

### Decision 3: Hard delete ao contratar
Ao fechar uma vaga (contratar), todos os registros de candidatos e arquivos são excluídos permanentemente do BD e do Storage.

**Alternativas consideradas:**
- Soft delete: mantém histórico, mais complexo e potencial risco de privacidade
- Exportar antes de excluir: escopo futuro se necessário

**Razão:** Alinhado com a política de privacidade da Britasul e simplifica o sistema.

### Decision 4: Perguntas do teste gerenciadas via banco
As perguntas do teste ficam em uma tabela `questions` associada a `job_id` ou `area`. O recrutador pode editá-las via dashboard Supabase inicialmente.

**Razão:** Evita complexidade de UI de gerenciamento de questões no MVP.

## Risks / Trade-offs

- **[Risco] Exclusão irreversível de dados** → Mitigação: confirmação dupla no UI ao contratar; possibilidade futura de exportação PDF antes da exclusão
- **[Risco] Candidatos não autenticados perdendo progresso** → Mitigação: salvar progresso no `localStorage` até o submit final
- **[Risco] Upload de arquivos maliciosos** → Mitigação: validar MIME type (PDF only) no client e server; limite de tamanho (5MB)
- **[Trade-off] Questões não editáveis via UI** → aceito no MVP; roadmap futuro inclui CRUD de questões

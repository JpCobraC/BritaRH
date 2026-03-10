## Why

O recrutador não tem como criar ou gerenciar vagas pela interface do BritaRH. Sem isso, o fluxo de candidatura (`candidate-recruitment-flow`) não tem vagas para exibir. O cadastro de vagas — incluindo descrição, requisitos, atribuições e as perguntas do teste — precisa ser feito pelo recrutador diretamente na plataforma.

## What Changes

- Adicionar página de criação de vaga no painel do recrutador
- O formulário da vaga inclui: título, área, tipo de contrato, carga horária/turno, local de trabalho, requisitos e atribuições
- O recrutador cadastra as perguntas do teste (múltipla escolha) diretamente na criação da vaga
- Vagas criadas ficam visíveis na listagem pública para candidatos
- Recrutador pode editar uma vaga enquanto ainda está aberta

## Capabilities

### New Capabilities

- `vacancy-creation`: Formulário completo de criação de vaga pelo recrutador (campos + perguntas do teste)
- `vacancy-editing`: Edição de vaga aberta (campos e questões do teste)
- `test-question-builder`: Interface para adicionar/remover/editar questões de múltipla escolha vinculadas à vaga

### Modified Capabilities

- `recruiter-dashboard`: O painel do recrutador agora inclui botão "Nova Vaga" e lista vagas já criadas com status

## Impact

- **Banco de dados**: tabela `jobs` precisa de campos adicionais (contract_type, schedule, workplace); tabela `questions` precisa ser populada via UI
- **Backend**: endpoints/server actions para criar e editar vagas e questões
- **Frontend**: novas páginas no painel do recrutador (/recruiter/jobs/new, /recruiter/jobs/[id]/edit)
- **Dependência**: este change deve ser implementado antes ou em paralelo com `candidate-recruitment-flow`

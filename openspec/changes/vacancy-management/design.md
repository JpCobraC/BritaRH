## Context

Este change adiciona o gerenciamento de vagas ao painel do recrutador. A tabela `jobs` já foi prevista no `candidate-recruitment-flow`, mas os campos são mínimos e a UI de criação não existe. Este change expande o modelo de dados e cria as telas de criação/edição de vagas.

## Goals / Non-Goals

**Goals:**
- Formulário de criação de vaga com: título, área, tipo de contrato, carga horária/turno, local de trabalho, requisitos (rich text ou lista), atribuições (rich text ou lista)
- Interface de criação de questões de múltipla escolha vinculadas à vaga (mínimo 5, máximo 20 questões)
- Edição de vaga e questões enquanto a vaga está aberta (sem candidatos) ou com candidatos (apenas campos não relacionados ao teste)
- Listagem de vagas criadas no painel do recrutador com status (aberta/fechada)

**Non-Goals:**
- Aprovação de vagas por um gestor antes de publicar
- Vaga em rascunho (draft) — ao salvar, já fica visível
- Histórico de edições de vagas
- Duplicação de vagas

## Decisions

### Decision 1: Questões criadas inline no formulário da vaga
As perguntas do teste são criadas dentro do mesmo formulário de criação de vaga, em uma seção dedicada com componente dinâmico (adicionar/remover questões).

**Alternativas consideradas:**
- Tela separada de gerenciamento de questões: mais cliques, mas mais organizado para muitas questões
- Questões pré-cadastradas por área: menos flexível, recrutador não tem controle

**Razão:** Simples para o recrutador, mantém tudo num fluxo único de criação.

### Decision 2: Mínimo de questões obrigatório
A vaga só pode ser publicada se tiver no mínimo **5 questões** cadastradas. Sem questões, o teste não faz sentido.

### Decision 3: Edição restrita com candidatos ativos
Se a vaga já possui candidatos, apenas campos descritivos (título, requisitos, atribuições) podem ser editados. As questões do teste ficam bloqueadas para edição após o primeiro candidato se inscrever.

**Razão:** Evita inconsistência entre pontuações de candidatos que fizeram o teste com versões diferentes das questões.

## Risks / Trade-offs

- **[Risco] Recrutador salva vaga sem questões** → Mitigação: validação client + server, mínimo 5 questões obrigatório
- **[Risco] Edição de questões com candidatos** → Mitigação: bloqueio via regra no backend ao detectar candidatos existentes
- **[Trade-off] Sem modo rascunho** → aceito no MVP; vaga ativa imediatamente ao salvar

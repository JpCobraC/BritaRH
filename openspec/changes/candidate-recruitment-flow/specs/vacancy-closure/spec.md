## ADDED Requirements

### Requirement: Fechamento de vaga e contratação
O sistema SHALL permitir que o recrutador selecione um candidato para contratar e feche a vaga.
Ao fechar a vaga, o sistema SHALL excluir permanentemente todos os dados de candidatos (formulário, pontuação, mensagem) e os arquivos de currículo do storage.
A vaga SHALL ser marcada como fechada e não aparecerá mais para novos candidatos.
O sistema SHALL solicitar confirmação dupla antes de executar a exclusão.

#### Scenario: Contratação confirmada
- **WHEN** o recrutador clica em "Contratar" em um candidato e confirma a ação duas vezes
- **THEN** o sistema exclui todos os dados e arquivos de candidatos da vaga e a marca como fechada

#### Scenario: Cancelamento da contratação
- **WHEN** o recrutador clica em "Contratar" mas cancela na confirmação
- **THEN** o sistema não realiza nenhuma alteração

#### Scenario: Vaga fechada invisível para candidatos
- **WHEN** um candidato acessa a lista de vagas após o fechamento
- **THEN** a vaga fechada não aparece na listagem de vagas disponíveis

#### Scenario: Exclusão de arquivos confirmada
- **WHEN** a vaga é fechada com sucesso
- **THEN** todos os PDFs associados à vaga são removidos do storage

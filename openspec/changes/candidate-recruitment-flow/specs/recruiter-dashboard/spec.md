## ADDED Requirements

### Requirement: Painel do recrutador
O sistema SHALL apresentar ao recrutador autenticado um painel com todas as vagas ativas.
Para cada vaga, o recrutador SHALL visualizar a lista de candidatos com: nome, pontuação do teste, link para o currículo, e mensagem opcional.
O recrutador SHALL conseguir ordenar candidatos por pontuação do teste.

#### Scenario: Visualização de candidatos por vaga
- **WHEN** o recrutador acessa o painel e seleciona uma vaga
- **THEN** o sistema exibe a lista de candidatos com suas pontuações e links para currículo

#### Scenario: Download do currículo
- **WHEN** o recrutador clica no link do currículo de um candidato
- **THEN** o sistema disponibiliza o PDF para download ou visualização

#### Scenario: Ordenação por pontuação
- **WHEN** o recrutador clica em "Ordenar por acertos"
- **THEN** o sistema reordena a lista de candidatos do maior para o menor número de acertos

#### Scenario: Vaga sem candidatos
- **WHEN** o recrutador acessa uma vaga que não possui candidatos ainda
- **THEN** o sistema exibe mensagem informando que não há candidatos para essa vaga

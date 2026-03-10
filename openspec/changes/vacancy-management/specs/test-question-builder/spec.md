## ADDED Requirements

### Requirement: Interface de criação de questões do teste
O sistema SHALL fornecer, dentro do formulário de criação de vaga, uma seção para adicionar questões de múltipla escolha.
Cada questão SHALL ter: enunciado, 4 alternativas (A, B, C, D) e marcação da alternativa correta.
O sistema SHALL exigir no mínimo 5 questões antes de permitir salvar a vaga.
O sistema SHALL permitir no máximo 20 questões por vaga.
O recrutador SHALL poder adicionar e remover questões dinamicamente.

#### Scenario: Adição de questão
- **WHEN** o recrutador clica em "Adicionar questão"
- **THEN** o sistema exibe um novo bloco de questão com campos de enunciado, 4 alternativas e seleção da correta

#### Scenario: Tentativa de salvar com menos de 5 questões
- **WHEN** o recrutador tenta salvar a vaga com menos de 5 questões cadastradas
- **THEN** o sistema exibe mensagem de erro indicando o mínimo obrigatório e bloqueia o salvamento

#### Scenario: Limite máximo atingido
- **WHEN** o recrutador já cadastrou 20 questões e tenta adicionar mais uma
- **THEN** o sistema desabilita o botão "Adicionar questão" e exibe mensagem de limite atingido

#### Scenario: Remoção de questão
- **WHEN** o recrutador clica em "Remover" em uma questão
- **THEN** o sistema remove o bloco da questão do formulário

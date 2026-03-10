## ADDED Requirements

### Requirement: Teste de conhecimentos da área
O sistema SHALL apresentar um teste de múltipla escolha após o formulário de perfil.
O teste SHALL conter questões específicas da área da vaga.
O sistema SHALL registrar a pontuação (número de acertos) do candidato ao finalizar.
O candidato SHALL responder todas as questões antes de avançar.

#### Scenario: Conclusão do teste
- **WHEN** o candidato responde todas as questões e clica em "Finalizar teste"
- **THEN** o sistema calcula a pontuação, armazena temporariamente e avança para upload do currículo

#### Scenario: Questão sem resposta
- **WHEN** o candidato tenta finalizar sem responder todas as questões
- **THEN** o sistema destaca as questões não respondidas e bloqueia o avanço

#### Scenario: Recrutador visualiza pontuação
- **WHEN** o recrutador acessa o painel de candidatos de uma vaga
- **THEN** o sistema exibe o número de acertos de cada candidato ao lado do seu nome

## ADDED Requirements

### Requirement: Criação de vaga pelo recrutador
O sistema SHALL fornecer um formulário de criação de vaga acessível no painel do recrutador.
O formulário SHALL coletar: título da vaga, área, tipo de contrato (CLT/PJ/Temporário), carga horária/turno, local de trabalho, requisitos e atribuições.
Todos os campos SHALL ser obrigatórios.
A vaga SHALL ficar visível na listagem pública imediatamente após salvar.

#### Scenario: Criação bem-sucedida
- **WHEN** o recrutador preenche todos os campos e salva a vaga com ao menos 5 questões
- **THEN** o sistema persiste a vaga no banco, publica na listagem de vagas e redireciona para o painel

#### Scenario: Campo obrigatório vazio
- **WHEN** o recrutador tenta salvar sem preencher um ou mais campos obrigatórios
- **THEN** o sistema destaca os campos inválidos e bloqueia o salvamento

#### Scenario: Vaga publicada aparece para candidatos
- **WHEN** a vaga é salva com sucesso
- **THEN** candidatos autenticados podem vê-la na listagem de vagas abertas

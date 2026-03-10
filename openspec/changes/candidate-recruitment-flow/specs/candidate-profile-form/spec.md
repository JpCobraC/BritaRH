## ADDED Requirements

### Requirement: Formulário de perfil do candidato
O sistema SHALL apresentar um formulário de perfil ao candidato após selecionar uma vaga.
O formulário SHALL coletar: tempo de atuação na área, experiências anteriores, local de residência, disponibilidade de horários, e-mail e telefone para contato.
Todos os campos SHALL ser obrigatórios.

#### Scenario: Preenchimento completo do formulário
- **WHEN** o candidato preenche todos os campos e clica em "Avançar"
- **THEN** o sistema valida os dados e avança para a etapa do teste

#### Scenario: Campo obrigatório vazio
- **WHEN** o candidato tenta avançar sem preencher um ou mais campos obrigatórios
- **THEN** o sistema destaca os campos inválidos e exibe mensagem de erro por campo

#### Scenario: Progresso salvo localmente
- **WHEN** o candidato preenche parcialmente o formulário e sai da página
- **THEN** o sistema recupera os dados preenchidos ao retornar (localStorage)

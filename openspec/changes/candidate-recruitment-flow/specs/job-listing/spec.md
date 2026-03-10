## MODIFIED Requirements

### Requirement: Listagem de vagas com fluxo autenticado
O sistema SHALL redirecionar o candidato para login antes de iniciar a candidatura.
Após autenticação, o sistema SHALL iniciar o fluxo de candidatura na vaga previamente selecionada.

#### Scenario: Candidato não autenticado tenta se candidatar
- **WHEN** o candidato clica em "Candidatar-se" sem estar logado
- **THEN** o sistema redireciona para a tela de login Google e retorna à vaga após autenticação

#### Scenario: Candidato autenticado seleciona vaga
- **WHEN** o candidato autenticado clica em "Candidatar-se"
- **THEN** o sistema inicia o fluxo de candidatura (formulário de perfil)

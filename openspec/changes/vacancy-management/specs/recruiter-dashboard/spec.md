## MODIFIED Requirements

### Requirement: Painel do recrutador com gestão de vagas
O painel do recrutador SHALL exibir a listagem de todas as vagas criadas por ele, com status (aberta/fechada) e número de candidatos.
O recrutador SHALL poder iniciar a criação de uma nova vaga a partir do painel via botão "Nova Vaga".
O recrutador SHALL poder acessar a edição de uma vaga aberta a partir da listagem.

#### Scenario: Listagem de vagas no painel
- **WHEN** o recrutador acessa o painel
- **THEN** o sistema exibe todas as vagas criadas com título, status (aberta/fechada) e número de candidatos

#### Scenario: Criar nova vaga pelo painel
- **WHEN** o recrutador clica em "Nova Vaga"
- **THEN** o sistema redireciona para o formulário de criação de vaga

#### Scenario: Acessar edição de vaga
- **WHEN** o recrutador clica em "Editar" em uma vaga aberta
- **THEN** o sistema redireciona para o formulário de edição da vaga

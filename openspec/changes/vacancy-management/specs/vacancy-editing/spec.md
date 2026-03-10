## ADDED Requirements

### Requirement: Edição de vaga aberta
O sistema SHALL permitir que o recrutador edite uma vaga enquanto ela estiver aberta.
Se a vaga não tiver candidatos, todos os campos (incluindo questões do teste) SHALL ser editáveis.
Se a vaga já tiver candidatos, apenas os campos descritivos (título, requisitos, atribuições) SHALL ser editáveis; as questões do teste SHALL ficar bloqueadas.

#### Scenario: Edição sem candidatos
- **WHEN** o recrutador acessa a edição de uma vaga sem candidatos
- **THEN** o sistema exibe todos os campos e questões como editáveis

#### Scenario: Edição com candidatos — questões bloqueadas
- **WHEN** o recrutador acessa a edição de uma vaga que já possui candidatos
- **THEN** o sistema exibe as questões do teste em modo somente leitura com aviso explicativo

#### Scenario: Salvar edição bem-sucedida
- **WHEN** o recrutador altera os campos permitidos e salva
- **THEN** o sistema persiste as alterações e exibe mensagem de sucesso

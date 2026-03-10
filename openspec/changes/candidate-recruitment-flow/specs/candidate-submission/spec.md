## ADDED Requirements

### Requirement: Persistência da candidatura
O sistema SHALL salvar os dados do formulário, a pontuação do teste e o caminho do currículo em banco de dados ao concluir o envio.
O sistema SHALL associar a candidatura ao candidato autenticado e à vaga selecionada.
O sistema SHALL exibir mensagem de confirmação após o envio bem-sucedido.

#### Scenario: Candidatura enviada com sucesso
- **WHEN** o candidato conclui o upload do currículo e clica em "Confirmar candidatura"
- **THEN** o sistema persiste todos os dados no banco e exibe tela de confirmação

#### Scenario: Falha no envio
- **WHEN** ocorre erro ao salvar os dados (ex: falha de rede)
- **THEN** o sistema exibe mensagem de erro e mantém os dados para nova tentativa

#### Scenario: Candidatura duplicada
- **WHEN** o candidato tenta se candidatar à mesma vaga mais de uma vez
- **THEN** o sistema bloqueia com mensagem informando que já existe candidatura para essa vaga

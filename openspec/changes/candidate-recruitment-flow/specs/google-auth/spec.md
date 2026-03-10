## ADDED Requirements

### Requirement: Autenticação Google OAuth
O sistema SHALL permitir login via conta Google para candidatos e recrutadores.
O sistema SHALL distinguir os roles `candidate` e `recruiter` via metadados do usuário.
Recrutadores SHALL ser autorizados por e-mail previamente cadastrado (whitelist).

#### Scenario: Login bem-sucedido como candidato
- **WHEN** o usuário acessa a plataforma e clica em "Entrar com Google"
- **THEN** o sistema redireciona para o OAuth do Google, autentica e retorna à plataforma com role `candidate`

#### Scenario: Login de recrutador autorizado
- **WHEN** um e-mail na whitelist de recrutadores realiza login via Google
- **THEN** o sistema autentica com role `recruiter` e redireciona para o painel do recrutador

#### Scenario: Acesso negado a e-mail não autorizado como recrutador
- **WHEN** um e-mail fora da whitelist tenta acessar a rota de recrutador
- **THEN** o sistema exibe mensagem de acesso negado e redireciona para a home

#### Scenario: Sessão expirada
- **WHEN** o token de sessão do usuário expira
- **THEN** o sistema redireciona automaticamente para a tela de login

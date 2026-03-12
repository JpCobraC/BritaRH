## ADDED Requirements

### Requirement: Estrutura de monorepo
O repositório SHALL conter pastas `backend/`, `frontend/`, `infra/` e `.github/` na raiz.
Um `README.md` na raiz SHALL documentar como rodar o projeto localmente com Docker.
Um arquivo `.env.example` SHALL listar todas as variáveis de ambiente necessárias com descrição.

#### Scenario: Developer clona o repositório e sobe o ambiente
- **WHEN** o desenvolvedor executa `docker compose up`
- **THEN** os 4 serviços sobem (db, storage, backend, frontend) sem erros

#### Scenario: Arquivo .env.example presente
- **WHEN** o desenvolvedor copia `.env.example` para `.env`
- **THEN** o ambiente funciona com as configurações padrão de desenvolvimento

## ADDED Requirements

### Requirement: Pipeline CI/CD com GitHub Actions
O repositório SHALL ter dois workflows em `.github/workflows/`:
- `backend.yml`: executa `ruff check` + `mypy` + `pytest` em PRs e pushes para `main`
- `frontend.yml`: executa `eslint` + `tsc --noEmit` + `jest` (se houver testes) em PRs e pushes para `main`
Os workflows SHALL rodar em paralelo.
PRs não SHALL ser mergeáveis se qualquer check falhar.

#### Scenario: PR com erro de lint bloqueado
- **WHEN** um PR é aberto com código Python com erro de formatação (ruff)
- **THEN** o check `backend.yml` falha e o PR é bloqueado para merge

#### Scenario: Checks passam com código correto
- **WHEN** um PR é aberto com código sem erros
- **THEN** ambos os workflows passam e o PR fica disponível para merge

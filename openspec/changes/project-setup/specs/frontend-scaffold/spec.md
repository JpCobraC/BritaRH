## ADDED Requirements

### Requirement: Scaffold do frontend Next.js
O frontend SHALL usar Next.js 14+ com App Router e TypeScript strict.
NextAuth.js v5 SHALL estar configurado com Google Provider.
A rota `/api/auth/[...nextauth]` SHALL estar funcional.
Uma página de login SHALL exibir o botão "Entrar com Google".
`package.json` SHALL listar dependências: `next`, `next-auth`, `typescript`, `@types/react`.

#### Scenario: Página de login abre no browser
- **WHEN** o desenvolvedor acessa `http://localhost:3000`
- **THEN** a página de login é exibida com o botão "Entrar com Google"

#### Scenario: Build TypeScript sem erros
- **WHEN** o desenvolvedor executa `npx tsc --noEmit` no frontend
- **THEN** o comando conclui sem erros de tipo

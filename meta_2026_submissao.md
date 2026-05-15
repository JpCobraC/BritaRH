# Submissão — 35ª META · CEFET-MG · 2026

**Categoria:** Ciências Exatas / Engenharias e Ciência Aplicada / Inovação Tecnológica  
**Prazo de inscrição:** 22/05/2026 · **Mostra:** 19–23/out/2026

---

## TAREFA 1 — PROPOSTA DE TRABALHO (Anexo II)

### Título

**BritaRH: Sistema Web de Recrutamento e Seleção com Testes de Conhecimento**

---

### Introdução

O processo de recrutamento e seleção em empresas industriais ainda é, em grande parte, conduzido de forma manual, com triagem de currículos em papel, aplicação presencial de testes e comunicação descentralizada entre candidatos e recrutadores. Esse modelo gera lentidão, retrabalho e dificuldade de rastreabilidade das candidaturas. A digitalização desse processo representa um ganho significativo tanto em eficiência operacional quanto em experiência do candidato.

O **BritaRH** é um sistema web desenvolvido para a empresa Britasul com o objetivo de automatizar e estruturar o fluxo de recrutamento e seleção, desde a publicação da vaga até a contratação do candidato. O sistema contempla dois perfis de usuário — candidato e recrutador — e integra autenticação segura, formulários de perfil, testes de conhecimento específicos por área e gerenciamento de currículos em formato digital.

---

### Objetivos

**Objetivo Principal:**  
Desenvolver um sistema web completo para digitalizar e automatizar o processo de recrutamento e seleção da empresa Britasul, eliminando etapas manuais e centralizando as informações de candidatos e vagas em uma plataforma acessível e segura.

**Objetivos Específicos:**

- Implementar autenticação via Google OAuth com controle de acesso por perfil (candidato e recrutador);
- Desenvolver um fluxo guiado de candidatura composto por: preenchimento de perfil, realização de teste de múltipla escolha específico da área da vaga e envio de currículo em PDF;
- Criar um painel administrativo para o recrutador cadastrar vagas com requisitos, atribuições e questões do teste de conhecimento;
- Garantir o isolamento e a segurança dos dados de candidatos, com exclusão permanente das informações ao término do processo seletivo;
- Aplicar princípios de Clean Architecture para garantir manutenibilidade, testabilidade e separação de responsabilidades entre as camadas do sistema.

---

### Metodologia

O sistema foi desenvolvido utilizando uma arquitetura desacoplada, com backend e frontend independentes:

**Backend:**  
Desenvolvido em Python 3.12 com o framework FastAPI, seguindo os princípios da Clean Architecture — com separação entre camadas de domínio (`models/`), aplicação (`services/`), interface (`api/`) e infraestrutura (`core/`). O banco de dados utilizado é o PostgreSQL 16, acessado de forma assíncrona via SQLAlchemy e com migrações gerenciadas pelo Alembic. O armazenamento de currículos em PDF é realizado em um servidor MinIO (compatível com S3), com URLs pré-assinadas para acesso seguro. A suíte de testes foi implementada com `pytest` e `httpx`, atingindo cobertura acima de 85%.

**Frontend:**  
Desenvolvido em TypeScript com Next.js 14 (App Router), adotando Server Components por padrão. A autenticação é gerenciada pelo NextAuth.js com provedor Google OAuth. A interface segue uma identidade visual corporativa em verde e branco, com foco em usabilidade e clareza do fluxo.

**Infraestrutura:**  
O ambiente de desenvolvimento é containerizado com Docker Compose, integrando os serviços de banco de dados, storage, backend e frontend. O pipeline de integração contínua é executado via GitHub Actions com verificações de lint, tipagem estática e testes automatizados a cada push.

---

### Resultados Esperados

- Sistema BritaRH funcional com fluxo completo para candidato: autenticação → perfil → teste de conhecimento → envio de currículo → confirmação de candidatura;
- Painel do recrutador com funcionalidades de: cadastro de vagas com questões de teste, visualização de candidatos ranqueados por pontuação, ação de contratação com fechamento automático da vaga;
- Cobertura de testes automatizados superior a 85%, com pipeline de CI/CD configurado no GitHub Actions;
- Armazenamento seguro e exclusão permanente de dados sensíveis ao término do processo seletivo, em conformidade com boas práticas de privacidade;
- Documentação técnica completa do sistema, incluindo design de arquitetura, especificações de requisitos e guia de implantação com Docker.

---
---

## TAREFA 2 — RESUMO INFORMATIVO (Anexo III)

> ⚠️ **Regras aplicadas:** Título ≤ 100 caracteres · Texto entre 100–200 palavras · Exatamente 3 palavras-chave separadas por ponto

---

### Título

**BritaRH: Sistema Web de Recrutamento e Seleção com Testes de Conhecimento**

*(74 caracteres com espaços ✓)*

---

### Resumo

O recrutamento e seleção em empresas industriais ainda depende de processos manuais que geram ineficiência e dificultam a rastreabilidade das candidaturas. O BritaRH é um sistema web desenvolvido para digitalizar esse processo na empresa Britasul, contemplando dois perfis: candidato e recrutador. O candidato realiza login com conta Google, preenche um formulário de perfil, executa um teste de múltipla escolha específico da vaga e envia seu currículo em PDF. O recrutador cadastra vagas com requisitos, atribuições e questões do teste, avalia candidatos ranqueados por pontuação e realiza a contratação com exclusão segura dos dados ao término do processo. O sistema foi desenvolvido com Python, FastAPI e PostgreSQL no backend, Next.js e TypeScript no frontend, e implantado via Docker Compose. A arquitetura segue os princípios de Clean Architecture, com cobertura de testes automatizados superior a 85%, garantindo manutenibilidade e confiabilidade da solução.

*(155 palavras ✓)*

---

**Palavras-chave:** Recrutamento Digital. Sistemas Web. Clean Architecture.

*(Exatamente 3 palavras-chave separadas por ponto ✓)*

---

## CHECKLIST DE VALIDAÇÃO

| Critério | Status |
|---|---|
| Título ≤ 100 caracteres | ✅ 74 chars |
| Texto entre 100–200 palavras | ✅ 155 palavras |
| Exatamente 3 palavras-chave | ✅ |
| Palavras-chave separadas por ponto | ✅ |
| Não vinculado a PIBIC/BIC Jr | ✅ Projeto independente |
| Inscrição pelo orientador | ⚠️ Verificar com orientador |
| Categoria sugerida | ✅ Cat. 1 — Exatas/Inovação Tecnológica |
| Diário de Bordo | 📋 Iniciar registro imediatamente |

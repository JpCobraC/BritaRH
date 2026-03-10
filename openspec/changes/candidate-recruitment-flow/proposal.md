## Why

O BritaRH atualmente não possui um fluxo estruturado de candidatura: falta formulário de perfil, autenticação dos participantes e painel para o recrutador gerenciar candidatos. O processo precisa ser digitalizado e centralizado para que o RH possa selecionar e contratar com eficiência.

## What Changes

- Adicionar autenticação via Google OAuth para candidatos e recrutadores (roles distintos)
- Adicionar formulário de perfil do candidato (tempo na área, experiências, localização, disponibilidade, email, telefone)
- Manter o teste de conhecimentos específicos da área **após** o preenchimento do formulário
- Adicionar upload de currículo (PDF) e campo de mensagem opcional
- Salvar candidaturas em banco de dados (candidato + respostas + currículo + score do teste)
- Criar painel do recrutador: visualizar candidatos por vaga, ver score de cada candidato, escolher um para contratação
- Ao contratar: fechar a vaga e excluir todos os dados e arquivos dos candidatos

## Capabilities

### New Capabilities

- `google-auth`: Autenticação via Google OAuth com dois roles — candidato e recrutador
- `candidate-profile-form`: Formulário com dados do candidato (tempo na área, experiências, localização, disponibilidade, email, telefone)
- `area-knowledge-test`: Teste de perguntas específicas da área da vaga com pontuação registrada
- `resume-upload`: Upload de currículo PDF e mensagem opcional do candidato
- `candidate-submission`: Persistência de toda a candidatura no banco de dados
- `recruiter-dashboard`: Painel do recrutador para analisar candidatos com seus scores por vaga
- `vacancy-closure`: Fluxo de contratação — fechar vaga e excluir candidatos e arquivos

### Modified Capabilities

- `job-listing`: A visualização de vagas agora redireciona para o fluxo autenticado de candidatura

## Impact

- **Backend**: Precisa de autenticação OAuth, banco de dados relacional, armazenamento de arquivos (PDF)
- **Frontend**: Novas telas: login, formulário de perfil, teste, upload, painel do recrutador
- **Dados**: Armazenamento temporário de candidaturas (excluídas após contratação)
- **Privacidade**: Dados de candidatos tratados conforme política da Britasul; exclusão garantida ao fechar vaga

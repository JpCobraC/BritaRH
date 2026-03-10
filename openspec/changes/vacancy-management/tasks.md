## 1. Modelo de Dados

- [ ] 1.1 Expandir tabela `jobs` com campos: contract_type, schedule, workplace
- [ ] 1.2 Confirmar que tabela `questions` tem: id, job_id, text, options (JSON array), correct_index
- [ ] 1.3 Ajustar RLS do Supabase: recrutador pode criar/editar suas vagas; candidatos só leem vagas abertas

## 2. Criação de Vaga

- [ ] 2.1 Criar rota `/recruiter/jobs/new` protegida por role `recruiter`
- [ ] 2.2 Implementar formulário com campos: título, área, tipo de contrato, carga horária/turno, local, requisitos, atribuições
- [ ] 2.3 Validar campos obrigatórios no client e no server action
- [ ] 2.4 Implementar server action de criação (INSERT em `jobs` + INSERT em `questions`)

## 3. Builder de Questões do Teste

- [ ] 3.1 Criar componente `QuestionBuilder` com lista dinâmica de questões
- [ ] 3.2 Cada questão: campo de enunciado, 4 alternativas, seletor de resposta correta
- [ ] 3.3 Implementar botão "Adicionar questão" (máximo 20) e "Remover" por questão
- [ ] 3.4 Validar mínimo de 5 questões antes de permitir submit
- [ ] 3.5 Exibir mensagem de limite ao atingir 20 questões

## 4. Edição de Vaga

- [ ] 4.1 Criar rota `/recruiter/jobs/[id]/edit` protegida por role `recruiter`
- [ ] 4.2 Carregar dados da vaga e questões para pré-preencher o formulário
- [ ] 4.3 Detectar se a vaga tem candidatos (query em `applications`)
- [ ] 4.4 Bloquear edição das questões se houver candidatos (campo somente leitura + aviso)
- [ ] 4.5 Implementar server action de atualização com validações idênticas à criação

## 5. Painel do Recrutador (atualização)

- [ ] 5.1 Adicionar botão "Nova Vaga" na página do painel
- [ ] 5.2 Exibir vagas criadas com colunas: título, status (aberta/fechada), nº de candidatos
- [ ] 5.3 Adicionar link "Editar" por vaga aberta na listagem
- [ ] 5.4 Atualizar listagem em tempo real (ou revalidar) após criar/editar vaga

## 6. Testes e Validação

- [ ] 6.1 Testar criação de vaga com todos os campos e questões
- [ ] 6.2 Testar bloqueio de salvamento com menos de 5 questões
- [ ] 6.3 Testar edição: sem candidatos (tudo editável) vs. com candidatos (questões bloqueadas)
- [ ] 6.4 Confirmar que vaga aparece para candidatos imediatamente após criação

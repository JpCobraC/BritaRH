## ADDED Requirements

### Requirement: Upload de currículo e mensagem opcional
O sistema SHALL permitir que o candidato faça upload do currículo em formato PDF.
O tamanho máximo do arquivo SHALL ser de 5MB.
O sistema SHALL oferecer um campo de texto opcional para o candidato deixar uma mensagem ao recrutador.

#### Scenario: Upload bem-sucedido
- **WHEN** o candidato seleciona um arquivo PDF válido e clica em "Enviar candidatura"
- **THEN** o sistema faz upload do arquivo para o storage e avança para confirmação

#### Scenario: Arquivo com formato inválido
- **WHEN** o candidato tenta enviar um arquivo que não é PDF
- **THEN** o sistema exibe mensagem de erro indicando que apenas PDF é aceito

#### Scenario: Arquivo acima do limite de tamanho
- **WHEN** o candidato tenta enviar um arquivo maior que 5MB
- **THEN** o sistema exibe mensagem de erro com o limite de tamanho

#### Scenario: Envio sem mensagem
- **WHEN** o candidato submete o formulário sem preencher o campo de mensagem
- **THEN** o sistema aceita a candidatura normalmente (campo é opcional)

# Guia de Implantação e Infraestrutura Cloud — BritaRH

Este documento detalha a arquitetura de implantação em produção e os requisitos de infraestrutura em nuvem para o monorepo **BritaRH**. O sistema é projetado para rodar de forma distribuída e resiliente, utilizando serviços modernos de nuvem para otimização de custo e performance.

---

## 🛠️ Arquitetura de Implantação em Produção

O BritaRH adota uma arquitetura desacoplada onde o frontend, o backend, o banco de dados e o armazenamento de objetos residem em provedores distintos, comunicando-se por meio de conexões encriptadas (SSL/HTTPS):

```
               [ Navegador do Usuário ]
                          │
         ┌────────────────┴────────────────┐
         ▼                                 ▼
┌──────────────────┐             ┌──────────────────┐
│   Vercel (SSL)   │             │  Render / Railway│
│  (Next.js Front) │             │  (FastAPI Back)  │
└──────────────────┘             └────────┬─────────┘
                                          │
                         ┌────────────────┴────────────────┐
                         ▼                                 ▼
               ┌──────────────────┐              ┌──────────────────┐
               │  Neon PostgreSQL │              │   Cloudflare R2  │
               │ (Banco de Dados) │              │ (Armazenamento)  │
               └──────────────────┘              └──────────────────┘
```

---

## ☁️ Serviços e Provedores de Cloud

### 1. Frontend (Next.js) — Hospedagem na Vercel
- O frontend Next.js 14 (App Router) é hospedado na **Vercel**, aproveitando a renderização híbrida (RSC) e a distribuição global de conteúdo (Edge Network).
- O deploy é acionado automaticamente a cada commit nas branches de desenvolvimento e produção com suporte nativo a SSL automático.
- As rotas públicas (`/vagas`) e fluxos protegidos do recrutador (`/admin`, `/dashboard`) operam integrados a este domínio.

### 2. Backend (FastAPI) — Hospedagem no Render / Railway
- O backend FastAPI é empacotado e distribuído como imagem de container Docker baseado em Debian/Slim.
- O serviço de API roda de forma contínua, expondo a porta `8000`. O ciclo de inicialização executa o script de migração do banco de dados (`scripts/prestart.sh` executando `alembic upgrade head`).
- A saúde da instância é monitorada continuamente pelo healthcheck no endpoint `GET /api/v1/health`.

### 3. Banco de Dados — Neon PostgreSQL
- Armazenamento relacional e controle de concorrência com banco **Neon.tech** (PostgreSQL 16 Serverless).
- A integração usa SQLAlchemy de forma totalmente assíncrona (`asyncpg`). Em produção, a criptografia de transporte é obrigatória utilizando o sufixo encriptado `?ssl=require` na string de conexão.

### 4. Armazenamento de Arquivos — Cloudflare R2
- Utiliza **Cloudflare R2** para armazenamento durável de currículos em formato PDF de candidatos.
- A comunicação com o R2 emprega a biblioteca `boto3` sob o protocolo compatível com AWS S3, expondo endpoints privados e autenticação via Access/Secret Keys.
- Regras de CORS são aplicadas diretamente no bucket para restringir downloads e envios originados unicamente do domínio frontend oficial.

---

## 🔑 Credenciais e Redirecionamentos de Autenticação (OAuth)

Para habilitar o Onboarding via Google OAuth em produção, as credenciais configuradas no Google Cloud Console devem ser mapeadas da seguinte forma:

- **Origens JavaScript autorizadas:**
  - `https://seu-dominio-front.vercel.app` (URL do Frontend na Vercel)
- **URIs de redirecionamento autorizados:**
  - `https://seu-dominio-front.vercel.app/api/auth/callback/google`

---

## 📦 Dicionário de Variáveis de Ambiente

As seguintes variáveis de ambiente devem estar ativas nas configurações dos respectivos painéis de deploy (Vercel e Render/Railway):

### Variáveis do Frontend (Vercel)

| Variável | Tipo / Formato | Função |
| --- | --- | --- |
| `NEXTAUTH_URL` | URL completa | URL principal de produção do frontend Next.js. |
| `AUTH_URL` | URL completa | Ponto de entrada de APIs do NextAuth v5 (geralmente idêntico à URL principal). |
| `AUTH_SECRET` | String (32 caracteres) | Chave secreta de segurança para criptografar cookies de sessão. |
| `GOOGLE_CLIENT_ID` | String única | ID gerado no Google Cloud Console para o fluxo do Google OAuth. |
| `GOOGLE_CLIENT_SECRET` | String secreta | Segredo correspondente às credenciais Google OAuth. |
| `NEXT_PUBLIC_API_URL` | URL completa | Endpoint público da API do backend no Render/Railway (ex: `https://api.onrender.com/api/v1`). |
| `BACKEND_SECRET` | String | Segredo JWT simétrico correspondente ao configurado no backend. |

### Variáveis do Backend (Render / Railway)

| Variável | Tipo / Formato | Função |
| --- | --- | --- |
| `DATABASE_URL` | URL PostgreSQL assíncrona | String de conexão para o Neon (ex: `postgresql+asyncpg://owner:pwd@host/db?ssl=require`). |
| `BACKEND_SECRET` | String | Segredo JWT simétrico compartilhado com o frontend Next.js para validação de sessões. |
| `CORS_ORIGINS` | Array JSON | Origens autorizadas a acessar a API (ex: `["https://seu-dominio.vercel.app"]`). |
| `MINIO_ENDPOINT_URL` | URL completa | Endpoint S3-compatível da Cloudflare R2 (ex: `https://<id-conta>.r2.cloudflarestorage.com`). |
| `MINIO_BUCKET_CURRICULOS` | String | Nome do bucket privado de PDFs no Cloudflare R2 (ex: `britarh-curriculos`). |
| `MINIO_ROOT_USER` | String | ID da chave de acesso S3 pública do Cloudflare R2. |
| `MINIO_ROOT_PASSWORD` | String | Chave de acesso secreta privada correspondente no Cloudflare R2. |

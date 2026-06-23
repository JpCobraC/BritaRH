# Guia de Implantação em Produção e Domínio Online — BritaRH

Este guia detalha o processo de deploy em produção do monorepo **BritaRH** e a configuração de seu domínio online para que esteja acessível a candidatos e recrutadores.

---

## 🛠️ Visão Geral da Arquitetura de Produção

Para um ambiente de produção robusto e econômico, recomendamos a seguinte divisão de serviços:

```
               [ Navegador do Usuário ]
                          │
         ┌────────────────┴────────────────┐
         ▼                                 ▼
┌──────────────────┐             ┌──────────────────┐
│   Vercel (SSL)   │             │  Railway/Render  │
│  (Next.js Front) │             │  (FastAPI Back)  │
└──────────────────┘             └────────┬─────────┘
                                          │
                         ┌────────────────┴────────────────┐
                         ▼                                 ▼
               ┌──────────────────┐              ┌──────────────────┐
               │    Supa/Neon     │              │   AWS S3/B2/S3   │
               │ (PostgreSQL DB)  │              │ (PDF Storage)    │
               └──────────────────┘              └──────────────────┘
```

- **Frontend (Next.js):** Hospedado na **Vercel** (deploy automático via GitHub, SSL nativo, alta performance global).
- **Backend (FastAPI):** Hospedado no **Railway** ou **Render** (suporta containers Docker de forma contínua).
- **Banco de Dados:** PostgreSQL hospedado no Railway (Add-on) ou **Neon/Supabase** (tier gratuito robusto).
- **Armazenamento de Currículos:** Bucket compatível com S3 na **AWS S3**, **Backblaze B2** ou **Cloudflare R2** (MinIO é usado localmente, mas em produção prefere-se S3 gerenciado).

---

## 📦 Passo 1: Deploy do Banco de Dados (PostgreSQL)

Recomendamos usar o **Neon.tech** ou o próprio **Railway PostgreSQL**:
1. Crie um projeto PostgreSQL no Neon ou Railway.
2. Obtenha a Connection String do banco de dados (ex: `postgresql://user:password@ep-cool-pool-123456.us-east-2.aws.neon.tech/neondb?sslmode=require`).
3. Anote esta URL; ela será usada na variável `DATABASE_URL` do backend.

---

## 🚀 Passo 2: Deploy do Backend (FastAPI) no Railway

1. Acesse o [Railway.app](https://railway.app) e crie uma conta.
2. Inicie um novo projeto a partir do seu repositório GitHub.
3. Defina a pasta de origem do build como `backend/` (nas configurações de Root Directory do Railway).
4. O Railway detectará o `Dockerfile` automaticamente no subdiretório `backend`.
5. Adicione as seguintes **Variáveis de Ambiente** nas configurações do serviço:

| Variável | Valor Recomendado | Descrição |
| --- | --- | --- |
| `POSTGRES_HOST` | *(Omitido se usar DATABASE_URL direta)* | Host do banco de dados |
| `DATABASE_URL` | `postgresql+asyncpg://...` | Connection String assíncrona (usar `postgresql+asyncpg://` no início) |
| `BACKEND_SECRET` | `sua-chave-secreta-jwt-de-producao` | Mesma chave usada no NextAuth |
| `CORS_ORIGINS` | `["https://seu-dominio-front.vercel.app"]` | JSON array com as origens permitidas (URL do front) |
| `MINIO_HOST` | `s3.amazonaws.com` | Ou host do seu provedor de S3 (ex: Cloudflare R2 / Backblaze) |
| `MINIO_ROOT_USER` | `SUA_S3_ACCESS_KEY` | Chave de acesso S3 |
| `MINIO_ROOT_PASSWORD` | `SUA_S3_SECRET_KEY` | Chave secreta S3 |
| `MINIO_BUCKET_CURRICULOS` | `britarh-curriculos` | Nome do bucket na nuvem |
| `MINIO_ENDPOINT_URL` | `https://s3.amazonaws.com` | URL endpoint S3 (se aplicável) |

6. Nas configurações do serviço no Railway, clique em **Generate Domain** para obter a URL pública do seu backend (ex: `https://britarh-backend-production.up.railway.app`).

---

## ☁️ Passo 3: Configurar Bucket S3 para os Currículos

Como o MinIO local não persiste seus arquivos após destruir o container em servidores efêmeros, substitua-o por um serviço compatível com S3 gratuito/barato (ex: **Cloudflare R2** ou **Backblaze B2**):
1. Crie um bucket privado chamado `britarh-curriculos`.
2. Configure uma política de CORS no bucket para permitir requisições do seu domínio frontend.
3. Gere chaves de API (Access Key e Secret Key) com permissão de leitura/escrita no bucket.

---

## 💻 Passo 4: Deploy do Frontend (Next.js) na Vercel

1. Acesse a [Vercel](https://vercel.com) e conecte com seu GitHub.
2. Clique em **Add New Project** e selecione o repositório `BritaRH`.
3. Configure o diretório raiz como `frontend`.
4. Deixe o Framework Preset como **Next.js**.
5. Configure as **Environment Variables** nas configurações do projeto:

| Variável | Valor de Produção | Descrição |
| --- | --- | --- |
| `NEXTAUTH_SECRET` | `um-hash-aleatorio-de-32-caracteres` | Chave para assinar sessões JWT (use `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | `https://seu-dominio-front.vercel.app` | URL de produção do seu frontend Next.js |
| `NEXT_PUBLIC_API_URL` | `https://seu-backend.railway.app/api/v1` | URL da API gerada pelo Railway no Passo 2 |
| `GOOGLE_CLIENT_ID` | `xxx.apps.googleusercontent.com` | Client ID do Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | `gsp_xxx` | Client Secret do Google Cloud Console |

6. Clique em **Deploy**. A Vercel fornecerá um domínio padrão `.vercel.app` (ex: `https://britarh.vercel.app`).

---

## 🔑 Passo 5: Configurar Google OAuth no Google Cloud Console

Para que o login com o Google funcione no novo domínio de produção:
1. Acesse o [Google Cloud Console](https://console.cloud.google.com/).
2. Vá em **APIs e Serviços > Tela de permissão OAuth** e verifique se as configurações estão corretas.
3. Vá em **Credenciais** e edite a credencial do tipo **ID do cliente OAuth 2.0** utilizada no projeto.
4. Adicione em **Origens JavaScript autorizadas**:
   - `https://seu-dominio-front.vercel.app` (ex: `https://britarh.vercel.app`)
5. Adicione em **URIs de redirecionamento autorizados**:
   - `https://seu-dominio-front.vercel.app/api/auth/callback/google`
6. Salve as alterações. *(Pode levar alguns minutos para o Google propagar as novas URLs).*

---

## 🌐 Passo 6: Apontamento de Domínio Customizado (Opcional)

Se você adquiriu um domínio próprio (ex: `britarh.com.br` no Registro.br):

### No Frontend (Vercel)
1. Vá em **Settings > Domains** no painel do seu projeto Vercel.
2. Adicione `britarh.com.br` e `www.britarh.com.br`.
3. Siga as instruções de DNS fornecidas pela Vercel:
   - Adicione uma entrada **CNAME** para `www` apontando para `cname.vercel-dns.com`.
   - Adicione uma entrada **A** para o root `@` apontando para `76.76.21.21`.

### No Backend (Railway)
1. Vá em **Settings > Custom Domains** no painel do serviço backend no Railway.
2. Adicione `api.britarh.com.br`.
3. Configure a entrada **CNAME** correspondente no seu provedor de DNS apontando para o endereço fornecido pelo Railway.
4. Lembre-se de atualizar a variável `NEXT_PUBLIC_API_URL` no frontend para `https://api.britarh.com.br/api/v1` e a variável `CORS_ORIGINS` no backend para incluir `https://britarh.com.br`.

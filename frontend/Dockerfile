FROM node:20-alpine AS base

WORKDIR /app

# Instalar dependências
COPY package.json package-lock.json ./
RUN npm ci

# Copiar código-fonte
COPY . .

# Expor porta e rodar em modo dev com Turbopack (modo otimizado)
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--turbo"]

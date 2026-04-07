FROM python:3.12-slim

WORKDIR /app

# Dependências do sistema
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
  && rm -rf /var/lib/apt/lists/*

# Instalar dependências Python
COPY pyproject.toml .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir bcrypt python-jose[cryptography] && \
    pip install --no-cache-dir -e ".[dev]"

# Copiar código-fonte
COPY . .

# Expõe porta
EXPOSE 8000

# Entrypoint que roda migrações e depois o comando CMD
ENTRYPOINT ["/app/scripts/prestart.sh"]

# Comando padráo para rodar uvicorn com hot-reload
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

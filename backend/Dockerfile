FROM python:3.12-slim

WORKDIR /app

# Dependências do sistema
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
  && rm -rf /var/lib/apt/lists/*

# Instalar dependências Python
COPY pyproject.toml .
RUN pip install --no-cache-dir -e ".[dev]"

# Copiar código-fonte
COPY . .

# Rodar uvicorn com hot-reload em dev
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

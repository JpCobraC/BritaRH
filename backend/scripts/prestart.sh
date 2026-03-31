#!/bin/bash
set -e

# Aguarda o banco de dados estar disponível (opcional, dependendo do docker-compose)
# echo "Waiting for database..."
# sleep 5

# Roda as migrações automáticas do Alembic para subir o schema
echo "Running migrations..."
alembic upgrade head

# Traz alguns dados iniciais se necessário (seeds) aqui
# python -m app.scripts.seed_data

echo "Backend pre-start finished. Starting server..."
exec "$@"

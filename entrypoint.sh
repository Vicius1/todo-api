#!/bin/sh

set -e

echo "Executando migrações do banco de dados..."
npx prisma migrate deploy

echo "Migrações concluídas. Iniciando o servidor..."

exec node src/server.js
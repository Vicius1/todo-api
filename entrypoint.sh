#!/bin/sh

set -e

echo "Executando migrações do banco de dados..."
npx prisma migrate deploy

echo "Migrações concluídas. Iniciando o servidor..."

# O 'exec "$@"' executa o comando principal que foi passado para o contêiner.
exec "$@"
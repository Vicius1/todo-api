# Imagem base
FROM node:lts-alpine

# Diretório de trabalho
WORKDIR /app

# Copiar os arquivos de dependência
COPY package*.json ./

# Copiar o schema do Prisma ANTES de instalar as dependências.
COPY prisma ./prisma/

# Instalar as dependências.
RUN npm install

# Copiar o resto do código da aplicação.
COPY . .

# Expor a porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start"]
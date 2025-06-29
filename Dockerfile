# ---- ESTÁGIO DE BUILD ----
FROM node:lts-alpine AS builder

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma/

RUN npm install

COPY . .

# ---- ESTÁGIO DE PRODUÇÃO ----
FROM node:lts-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/src ./src

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
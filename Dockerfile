FROM node:20-slim AS deps
WORKDIR /app

# Install dependencies (faster cache)
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:20-slim AS builder
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Prisma client + build Next
RUN npx prisma generate --schema prisma/schema.prisma
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Minimal runtime files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/docker/entrypoint.sh ./docker/entrypoint.sh

RUN chmod +x ./docker/entrypoint.sh

EXPOSE 3000 80

# Ensure Prisma + DB schema + initial admin (idempotent) then run Next
CMD ["./docker/entrypoint.sh"]



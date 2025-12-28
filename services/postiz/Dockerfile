FROM node:22-slim AS builder
WORKDIR /repo

RUN corepack enable

# Default build-time env so Next.js can embed NEXT_PUBLIC_* and basePath correctly
ENV POSTIZ_BASE_PATH=/social
ENV FRONTEND_URL=http://host.docker.internal/social
ENV NEXT_PUBLIC_BACKEND_URL=http://host.docker.internal/social/api
ENV STORAGE_PROVIDER=cloudflare

COPY postiz-app-main/package.json postiz-app-main/pnpm-lock.yaml postiz-app-main/pnpm-workspace.yaml ./postiz-app-main/
COPY postiz-app-main/apps/backend/package.json ./postiz-app-main/apps/backend/package.json
COPY postiz-app-main/apps/frontend/package.json ./postiz-app-main/apps/frontend/package.json
COPY postiz-app-main/apps/workers/package.json ./postiz-app-main/apps/workers/package.json
COPY postiz-app-main/apps/cron/package.json ./postiz-app-main/apps/cron/package.json
COPY postiz-app-main/libraries ./postiz-app-main/libraries
COPY postiz-app-main/scripts ./postiz-app-main/scripts

RUN cd postiz-app-main && pnpm install --frozen-lockfile

COPY postiz-app-main ./postiz-app-main

RUN cd postiz-app-main && pnpm run build

FROM node:22-slim AS runner
WORKDIR /app/postiz-app-main
ENV NODE_ENV=production

RUN corepack enable

COPY --from=builder /repo/postiz-app-main /app/postiz-app-main

# Default command is overridden per service in docker-compose
CMD ["node", "-e", "console.log('Postiz image built. Override CMD in compose.')"]



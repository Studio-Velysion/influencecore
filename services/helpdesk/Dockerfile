FROM node:20-slim AS desk-builder
WORKDIR /repo

# Build Helpdesk UI (desk)
COPY helpdesk-develop/desk/package.json helpdesk-develop/desk/yarn.lock ./helpdesk-develop/desk/
RUN corepack enable && corepack prepare yarn@1.22.22 --activate
RUN cd helpdesk-develop/desk && yarn install --frozen-lockfile
COPY helpdesk-develop/desk ./helpdesk-develop/desk
RUN cd helpdesk-develop/desk && yarn build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8000

COPY services/helpdesk/package.json ./package.json
RUN npm install --omit=dev --no-audit --no-fund

COPY services/helpdesk/server.js ./server.js
COPY --from=desk-builder /repo/helpdesk-develop/desk/dist ./helpdesk-develop/desk/dist

EXPOSE 8000
CMD ["node", "server.js"]



FROM node:22.20-alpine

# Coolify-ready production image:
# - builds all apps
# - runs nginx as a reverse proxy on port 80
# - runs backend/workers/cron/frontend via pm2

ARG NEXT_PUBLIC_VERSION
ENV NEXT_PUBLIC_VERSION=$NEXT_PUBLIC_VERSION

# Provide a build-time DATABASE_URL so prisma generate during install doesn't fail.
# (Coolify will inject the real one at runtime.)
ARG DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postiz?schema=public
ENV DATABASE_URL=$DATABASE_URL

RUN apk add --no-cache g++ make python3 bash nginx
RUN adduser -D -g 'www' www
RUN mkdir -p /www /uploads
RUN chown -R www:www /var/lib/nginx /www /uploads

RUN npm --no-update-notifier --no-fund --global install pnpm@10.6.1 pm2

WORKDIR /app
COPY . /app

# Nginx config for Coolify (port 80)
COPY var/docker/nginx.coolify.conf /etc/nginx/nginx.conf

RUN pnpm install
RUN NODE_OPTIONS="--max-old-space-size=4096" pnpm run build

EXPOSE 80

# Runs:
# - prisma db push (root script)
# - pm2 processes (frontend/backend/workers/cron)
# - nginx reverse proxy
CMD ["sh", "-c", "nginx && pnpm run pm2-run"]



#!/usr/bin/env sh
set -eu

echo "[entrypoint] Prisma generate..."
npx prisma generate --schema prisma/schema.prisma

if [ "${AUTO_DB_PUSH:-true}" = "true" ]; then
  echo "[entrypoint] Prisma db push..."
  npm run db:push
fi

echo "[entrypoint] Create initial admin (idempotent)..."
node scripts/create-initial-admin.cjs || true

PORT="${PORT:-3000}"
echo "[entrypoint] Starting Next on port ${PORT}..."
exec npx next start -H 0.0.0.0 -p "${PORT}"



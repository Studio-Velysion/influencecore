/**
 * Entrypoint cross-platform (Windows/Linux) pour lancer InfluenceCore.
 *
 * Objectif: créer automatiquement les tables Postgres au démarrage (Prisma db push),
 * puis créer le premier admin si demandé, puis démarrer Next.
 *
 * Variables:
 * - DATABASE_URL (obligatoire)
 * - AUTO_DB_PUSH=true|false (défaut: true)
 * - INITIAL_ADMIN_EMAIL / INITIAL_ADMIN_PASSWORD / ... (optionnel)
 */

const { spawnSync } = require('child_process')

function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: process.env,
    ...opts,
  })
  if (res.status !== 0) {
    const msg = `[entrypoint] Command failed: ${cmd} ${args.join(' ')} (exit=${res.status})`
    const err = new Error(msg)
    err.exitCode = res.status
    throw err
  }
}

async function main() {
  console.log('[entrypoint] Prisma generate...')
  run('npx', ['prisma', 'generate', '--schema', 'prisma/schema.prisma'])

  const autoDbPush = String(process.env.AUTO_DB_PUSH ?? 'true').toLowerCase() === 'true'
  if (autoDbPush) {
    console.log('[entrypoint] Prisma db push...')
    // Non-interactif: pas de prompt.
    run('npx', ['prisma', 'db', 'push', '--schema', 'prisma/schema.prisma'])
  } else {
    console.log('[entrypoint] AUTO_DB_PUSH=false -> skip prisma db push')
  }

  console.log('[entrypoint] Create initial admin (idempotent)...')
  // Ne doit jamais empêcher l'app de démarrer.
  try {
    run('node', ['scripts/create-initial-admin.cjs'])
  } catch (e) {
    console.warn('[entrypoint] init-admin skipped/failed:', e?.message || e)
  }

  const port = process.env.PORT || '3000'
  console.log(`[entrypoint] Starting Next on port ${port}...`)
  run('npx', ['next', 'start', '-H', '0.0.0.0', '-p', String(port)])
}

main().catch((e) => {
  console.error('[entrypoint] Fatal:', e?.message || e)
  process.exit(typeof e?.exitCode === 'number' ? e.exitCode : 1)
})



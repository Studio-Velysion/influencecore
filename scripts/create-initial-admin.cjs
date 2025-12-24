/**
 * Crée le tout premier compte administrateur dans la DB InfluenceCore.
 *
 * - Ne fait rien si un admin existe déjà.
 * - Utilise les variables d'env:
 *   INITIAL_ADMIN_EMAIL
 *   INITIAL_ADMIN_PASSWORD
 *   INITIAL_ADMIN_NAME (optionnel)
 *   INITIAL_ADMIN_PSEUDO (optionnel)
 *
 * Usage (PowerShell):
 *   $env:INITIAL_ADMIN_EMAIL="moi@domaine.tld"
 *   $env:INITIAL_ADMIN_PASSWORD="MonMotDePasse"
 *   node scripts/create-initial-admin.cjs
 */

const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

function maskEmail(email) {
  if (!email) return ''
  const [user, domain] = String(email).split('@')
  if (!domain) return '***'
  return `${user?.slice(0, 2) || '*'}***@${domain}`
}

async function main() {
  const existingAdmins = await prisma.user.count({ where: { isAdmin: true } })
  if (existingAdmins > 0) {
    console.log('[init-admin] Un compte admin existe déjà, rien à faire.')
    return
  }

  const email = String(process.env.INITIAL_ADMIN_EMAIL || '').trim().toLowerCase()
  const password = String(process.env.INITIAL_ADMIN_PASSWORD || '')
  const name = String(process.env.INITIAL_ADMIN_NAME || 'Administrateur').trim() || 'Administrateur'
  const pseudo = String(process.env.INITIAL_ADMIN_PSEUDO || 'admin').trim() || 'admin'

  if (!email || !password) {
    console.log('[init-admin] Aucun admin trouvé, mais INITIAL_ADMIN_EMAIL / INITIAL_ADMIN_PASSWORD manquent.')
    console.log('[init-admin] -> Tu peux lancer le script manuellement ou fournir les variables d’environnement.')
    console.log('[init-admin] Exemple:')
    console.log('  INITIAL_ADMIN_EMAIL="moi@domaine.tld" INITIAL_ADMIN_PASSWORD="..." node scripts/create-initial-admin.cjs')
    return
  }

  if (password.length < 8) {
    console.log('[init-admin] Mot de passe trop court (min 8 caractères).')
    return
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      name,
      pseudo,
      isAdmin: true,
    },
    create: {
      email,
      passwordHash,
      name,
      pseudo,
      isAdmin: true,
    },
    select: {
      id: true,
      email: true,
      isAdmin: true,
      createdAt: true,
    },
  })

  console.log(`[init-admin] Admin créé/mis à jour: ${maskEmail(user.email)} (id=${user.id})`)
}

main()
  .catch((e) => {
    console.error('[init-admin] Erreur:', e?.message || e)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })



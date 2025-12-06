// Script d'initialisation du système d'administration
// À exécuter une seule fois après la migration de la base de données

import { PrismaClient } from '@prisma/client'
import { PERMISSIONS_BY_CATEGORY } from '../lib/permissions'

const prisma = new PrismaClient()

async function initAdmin() {
  console.log('🚀 Initialisation du système d\'administration...')

  try {
    // 1. Créer les permissions
    console.log('📝 Création des permissions...')
    const permissionsToCreate = Object.values(PERMISSIONS_BY_CATEGORY)
      .flat()
      .map((perm) => ({
        key: perm.key,
        name: perm.name,
        description: perm.description || null,
        category: Object.keys(PERMISSIONS_BY_CATEGORY).find((cat) =>
          PERMISSIONS_BY_CATEGORY[cat as keyof typeof PERMISSIONS_BY_CATEGORY].some(
            (p) => p.key === perm.key
          )
        ) || null,
      }))

    await prisma.permission.createMany({
      data: permissionsToCreate,
      skipDuplicates: true,
    })

    console.log(`✅ ${permissionsToCreate.length} permissions créées`)

    // 2. Créer le rôle Fondateur
    console.log('👑 Création du rôle Fondateur...')
    const founderRole = await prisma.role.upsert({
      where: { name: 'Fondateur' },
      update: {},
      create: {
        name: 'Fondateur',
        description: 'Rôle fondateur avec toutes les permissions - Gestion complète de la plateforme',
        isSystem: true,
      },
    })

    console.log('✅ Rôle Fondateur créé')

    // 3. Attribuer toutes les permissions au rôle Fondateur
    console.log('🔗 Attribution des permissions au rôle Fondateur...')
    const allPermissions = await prisma.permission.findMany()

    await prisma.rolePermission.createMany({
      data: allPermissions.map((perm) => ({
        roleId: founderRole.id,
        permissionId: perm.id,
      })),
      skipDuplicates: true,
    })

    console.log(`✅ ${allPermissions.length} permissions attribuées au rôle Fondateur`)

    console.log('✅ Initialisation terminée avec succès !')
    console.log('\n📋 Prochaines étapes :')
    console.log('1. Marquer votre utilisateur comme admin :')
    console.log('   UPDATE users SET is_admin = true WHERE email = \'votre@email.com\';')
    console.log('2. Attribuer le rôle Fondateur à votre utilisateur :')
    console.log('   INSERT INTO user_roles (id, user_id, role_id, created_at)')
    console.log('   SELECT gen_random_uuid(), u.id, r.id, NOW()')
    console.log('   FROM users u, roles r')
    console.log('   WHERE u.email = \'votre@email.com\' AND r.name = \'Fondateur\';')
    console.log('3. Aller sur /admin pour créer d\'autres rôles')
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  initAdmin()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export default initAdmin


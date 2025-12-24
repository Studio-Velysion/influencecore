// Script pour initialiser les permissions admin si elles n'existent pas
import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

// Charger .env.local manuellement
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim().replace(/^["']|["']$/g, '')
      process.env[key] = value
    }
  })
}

const prisma = new PrismaClient()

async function initPermissions() {
  console.log('🔧 Initialisation des permissions admin...\n')

  try {
    // Vérifier si les permissions existent déjà
    const existingPermissions = await prisma.permission.count()
    
    if (existingPermissions > 0) {
      console.log(`✅ ${existingPermissions} permissions existent déjà dans la base de données\n`)
      await prisma.$disconnect()
      return
    }

    console.log('📋 Création des permissions...')
    
    // Permissions de base pour l'admin
    const permissions = [
      { key: 'admin.access', name: 'Accès Admin', description: 'Accès au tableau de bord administrateur', category: 'admin' },
      { key: 'admin.users', name: 'Gestion Utilisateurs', description: 'Gérer les utilisateurs', category: 'admin' },
      { key: 'admin.roles', name: 'Gestion Rôles', description: 'Gérer les rôles et permissions', category: 'admin' },
      { key: 'admin.subscriptions', name: 'Gestion Abonnements', description: 'Gérer les abonnements et plans', category: 'admin' },
    ]

    await prisma.permission.createMany({
      data: permissions,
      skipDuplicates: true,
    })

    console.log(`✅ ${permissions.length} permissions créées\n`)

    // Vérifier si le rôle Fondateur existe
    const founderRole = await prisma.role.findUnique({
      where: { name: 'Fondateur' },
    })

    if (!founderRole) {
      console.log('👑 Création du rôle Fondateur...')
      const newFounderRole = await prisma.role.create({
        data: {
          name: 'Fondateur',
          description: 'Rôle fondateur avec toutes les permissions',
          isSystem: true,
        },
      })

      // Attribuer toutes les permissions au rôle Fondateur
      const allPermissions = await prisma.permission.findMany()
      await prisma.rolePermission.createMany({
        data: allPermissions.map(perm => ({
          roleId: newFounderRole.id,
          permissionId: perm.id,
        })),
        skipDuplicates: true,
      })

      console.log('✅ Rôle Fondateur créé avec toutes les permissions\n')
    } else {
      console.log('✅ Rôle Fondateur existe déjà\n')
    }

    console.log('✅ Initialisation terminée avec succès !\n')

  } catch (error: any) {
    console.error('❌ Erreur lors de l\'initialisation:', error.message)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

initPermissions().catch(console.error)


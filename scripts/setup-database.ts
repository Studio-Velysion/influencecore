// Script d'installation automatique de la base de données
// Ce script vérifie la connexion et crée les tables (sans comptes de test)

import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'

const prisma = new PrismaClient()

async function setupDatabase() {
  console.log('🚀 Installation automatique de la base de données...\n')

  try {
    // 1. Vérifier la connexion à la base de données
    console.log('📡 Vérification de la connexion à la base de données...')
    await prisma.$connect()
    console.log('✅ Connexion réussie !\n')

    // 2. Générer le client Prisma
    console.log('🔧 Génération du client Prisma...')
    try {
      execSync('npm run db:generate', { stdio: 'inherit' })
      console.log('✅ Client Prisma généré\n')
    } catch (error) {
      console.log('⚠️  Le client Prisma existe déjà\n')
    }

    // 3. Créer les tables (db:push)
    console.log('📊 Création des tables dans la base de données...')
    try {
      execSync('npm run db:push', { stdio: 'inherit' })
      console.log('✅ Tables créées avec succès\n')
    } catch (error) {
      console.log('⚠️  Erreur lors de la création des tables. Vérifiez votre schéma Prisma.\n')
      throw error
    }

    console.log('✅ Installation terminée avec succès !\n')
    console.log('💡 Vous pouvez maintenant :')
    console.log('   1. Lancer l\'application : npm run dev')
    console.log('   2. Vous connecter via Keycloak (SSO) ou votre système d\'auth')
  } catch (error: any) {
    console.error('\n❌ Erreur lors de l\'installation:', error.message)
    
    if (error.message?.includes("Can't reach database")) {
      console.error('\n💡 La base de données n\'est pas accessible.')
      console.error('   Consultez DEMARRER_DB.md ou SUPABASE_SETUP.md pour configurer votre base de données.\n')
    } else if (error.message?.includes("password authentication failed")) {
      console.error('\n💡 Erreur d\'authentification.')
      console.error('   Vérifiez votre DATABASE_URL dans le fichier .env\n')
    } else {
      console.error('\n💡 Vérifiez :')
      console.error('   1. Que votre DATABASE_URL est correcte dans .env')
      console.error('   2. Que la base de données est accessible')
      console.error('   3. Consultez TROUBLESHOOTING.md pour plus d\'aide\n')
    }
    
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('✅ Script terminé avec succès')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Erreur:', error)
      process.exit(1)
    })
}

export default setupDatabase


import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { checkPermission, PERMISSIONS, PERMISSIONS_BY_CATEGORY } from '@/lib/permissions'

// GET - Récupérer toutes les permissions disponibles
export async function GET(request: NextRequest) {
  try {
    const hasAccess = await checkPermission(PERMISSIONS.ADMIN_ROLES)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    // Récupérer les permissions depuis la base de données
    const dbPermissions = await prisma.permission.findMany({
      orderBy: [
        { category: 'asc' },
        { name: 'asc' },
      ],
    })

    // Si aucune permission en DB, initialiser avec les permissions par défaut
    if (dbPermissions.length === 0) {
      // Initialiser les permissions
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

      const newPermissions = await prisma.permission.findMany({
        orderBy: [
          { category: 'asc' },
          { name: 'asc' },
        ],
      })

      return NextResponse.json(newPermissions)
    }

    return NextResponse.json(dbPermissions)
  } catch (error) {
    console.error('Erreur lors de la récupération des permissions:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}


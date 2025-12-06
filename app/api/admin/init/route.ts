import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { PERMISSIONS, PERMISSIONS_BY_CATEGORY } from '@/lib/permissions'

// POST - Initialiser les permissions et créer le rôle Admin
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Vérifier si l'utilisateur est admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true },
    })

    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

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

    // Créer le rôle Fondateur système s'il n'existe pas
    const founderRole = await prisma.role.upsert({
      where: { name: 'Fondateur' },
      update: {},
      create: {
        name: 'Fondateur',
        description: 'Rôle fondateur avec toutes les permissions - Gestion complète de la plateforme',
        isSystem: true,
      },
    })

    // Attribuer toutes les permissions au rôle Fondateur
    const allPermissions = await prisma.permission.findMany()
    await prisma.rolePermission.createMany({
      data: allPermissions.map((perm) => ({
        roleId: founderRole.id,
        permissionId: perm.id,
      })),
      skipDuplicates: true,
    })

    return NextResponse.json({
      message: 'Système initialisé avec succès',
      permissionsCreated: permissionsToCreate.length,
      founderRoleId: founderRole.id,
    })
  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}


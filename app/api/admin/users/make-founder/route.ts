import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'
import { checkPermission, PERMISSIONS } from '@/lib/permissions'

// POST - Attribuer le rôle Fondateur à un utilisateur
export async function POST(request: NextRequest) {
  try {
    const hasAccess = await checkPermission(PERMISSIONS.ADMIN_USERS)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const body = await request.json()
    const { userId, email } = body

    if (!userId && !email) {
      return NextResponse.json(
        { error: 'userId ou email requis' },
        { status: 400 }
      )
    }

    // Trouver l'utilisateur
    let user
    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
      })
    } else {
      user = await prisma.user.findUnique({
        where: { email: email.trim().toLowerCase() },
      })
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Trouver le rôle Fondateur
    const founderRole = await prisma.role.findUnique({
      where: { name: 'Fondateur' },
    })

    if (!founderRole) {
      return NextResponse.json(
        { error: 'Le rôle Fondateur n\'existe pas. Exécutez d\'abord /api/admin/init' },
        { status: 404 }
      )
    }

    // Vérifier si le rôle n'est pas déjà attribué
    const existingUserRole = await prisma.userRole.findUnique({
      where: {
        userId_roleId: {
          userId: user.id,
          roleId: founderRole.id,
        },
      },
    })

    if (existingUserRole) {
      return NextResponse.json(
        { error: 'Cet utilisateur a déjà le rôle Fondateur' },
        { status: 400 }
      )
    }

    // Attribuer le rôle Fondateur
    const userRole = await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: founderRole.id,
      },
      include: {
        role: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            pseudo: true,
          },
        },
      },
    })

    return NextResponse.json({
      message: 'Rôle Fondateur attribué avec succès',
      userRole,
    })
  } catch (error) {
    console.error('Erreur lors de l\'attribution du rôle Fondateur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}


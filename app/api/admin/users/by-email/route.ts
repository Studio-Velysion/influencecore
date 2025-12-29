import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'
import { checkPermission, PERMISSIONS } from '@/lib/permissions'

// POST - Trouver ou créer un utilisateur par email et lui attribuer un rôle
export async function POST(request: NextRequest) {
  try {
    const hasAccess = await checkPermission(PERMISSIONS.ADMIN_USERS)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const body = await request.json()
    const { email, roleId } = body

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: 'L\'email est requis' },
        { status: 400 }
      )
    }

    if (!roleId) {
      return NextResponse.json(
        { error: 'L\'ID du rôle est requis' },
        { status: 400 }
      )
    }

    // Vérifier que le rôle existe
    const role = await prisma.role.findUnique({
      where: { id: roleId },
    })

    if (!role) {
      return NextResponse.json(
        { error: 'Rôle non trouvé' },
        { status: 404 }
      )
    }

    // Chercher l'utilisateur par email
    let user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    })

    // Si l'utilisateur n'existe pas, créer un compte sans mot de passe (il devra le définir)
    if (!user) {
      // Générer un mot de passe temporaire aléatoire
      const tempPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12)
      const bcrypt = require('bcryptjs')
      const passwordHash = await bcrypt.hash(tempPassword, 10)

      user = await prisma.user.create({
        data: {
          email: email.trim().toLowerCase(),
          passwordHash, // Mot de passe temporaire
          // L'utilisateur devra réinitialiser son mot de passe
        },
      })
    }

    // Vérifier si le rôle n'est pas déjà attribué
    const existingUserRole = await prisma.userRole.findUnique({
      where: {
        userId_roleId: {
          userId: user.id,
          roleId: roleId,
        },
      },
    })

    if (existingUserRole) {
      return NextResponse.json(
        { 
          error: 'Ce rôle est déjà attribué à cet utilisateur',
          user: {
            id: user.id,
            email: user.email,
          },
        },
        { status: 400 }
      )
    }

    // Attribuer le rôle
    const userRole = await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: roleId,
      },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
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

    return NextResponse.json(
      {
        message: 'Rôle attribué avec succès',
        userRole,
        userCreated: !existingUserRole,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erreur lors de l\'attribution du rôle:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}


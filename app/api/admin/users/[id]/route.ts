import { NextRequest, NextResponse } from 'next/server'
import { getServerSessionWithTest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkPermission, PERMISSIONS } from '@/lib/permissions'

// GET - Récupérer un utilisateur spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hasAccess = await checkPermission(PERMISSIONS.ADMIN_USERS)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        name: true,
        pseudo: true,
        avatar: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
        userRoles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: {
                      select: {
                        id: true,
                        key: true,
                        name: true,
                        description: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        subscriptions: {
          include: {
            plan: {
              select: {
                id: true,
                name: true,
                price: true,
                currency: true,
                interval: true,
              },
            },
            discount: {
              select: {
                id: true,
                code: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5, // Derniers 5 abonnements
        },
        invoices: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 5, // Dernières 5 factures
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour un utilisateur
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hasAccess = await checkPermission(PERMISSIONS.ADMIN_USERS)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const body = await request.json()
    const { name, pseudo, email, isAdmin } = body

    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier si l'email existe déjà (sauf pour cet utilisateur)
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      })

      if (emailExists) {
        return NextResponse.json(
          { error: 'Cet email est déjà utilisé' },
          { status: 400 }
        )
      }
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        name: name !== undefined ? name : existingUser.name,
        pseudo: pseudo !== undefined ? pseudo : existingUser.pseudo,
        email: email !== undefined ? email : existingUser.email,
        isAdmin: isAdmin !== undefined ? isAdmin : existingUser.isAdmin,
      },
      select: {
        id: true,
        email: true,
        name: true,
        pseudo: true,
        isAdmin: true,
        createdAt: true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}


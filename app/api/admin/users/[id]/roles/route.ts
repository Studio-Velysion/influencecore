import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { checkPermission, PERMISSIONS } from '@/lib/permissions'

// GET - Récupérer les rôles d'un utilisateur
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hasAccess = await checkPermission(PERMISSIONS.ADMIN_USERS)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const userRoles = await prisma.userRole.findMany({
      where: { userId: params.id },
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
      },
    })

    return NextResponse.json(userRoles)
  } catch (error) {
    console.error('Erreur lors de la récupération des rôles:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST - Attribuer un rôle à un utilisateur
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hasAccess = await checkPermission(PERMISSIONS.ADMIN_USERS)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const body = await request.json()
    const { roleId } = body

    if (!roleId) {
      return NextResponse.json(
        { error: 'L\'ID du rôle est requis' },
        { status: 400 }
      )
    }

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: params.id },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
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

    // Vérifier si le rôle n'est pas déjà attribué
    const existingUserRole = await prisma.userRole.findUnique({
      where: {
        userId_roleId: {
          userId: params.id,
          roleId: roleId,
        },
      },
    })

    if (existingUserRole) {
      return NextResponse.json(
        { error: 'Ce rôle est déjà attribué à cet utilisateur' },
        { status: 400 }
      )
    }

    // Attribuer le rôle
    const userRole = await prisma.userRole.create({
      data: {
        userId: params.id,
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
      },
    })

    return NextResponse.json(userRole, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de l\'attribution du rôle:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE - Retirer un rôle d'un utilisateur
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hasAccess = await checkPermission(PERMISSIONS.ADMIN_USERS)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const roleId = searchParams.get('roleId')

    if (!roleId) {
      return NextResponse.json(
        { error: 'L\'ID du rôle est requis' },
        { status: 400 }
      )
    }

    await prisma.userRole.delete({
      where: {
        userId_roleId: {
          userId: params.id,
          roleId: roleId,
        },
      },
    })

    return NextResponse.json({ message: 'Rôle retiré avec succès' })
  } catch (error) {
    console.error('Erreur lors du retrait du rôle:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}


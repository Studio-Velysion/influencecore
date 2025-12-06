import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { checkPermission, PERMISSIONS } from '@/lib/permissions'

// GET - Récupérer un rôle spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hasAccess = await checkPermission(PERMISSIONS.ADMIN_ROLES)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const role = await prisma.role.findUnique({
      where: { id: params.id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        _count: {
          select: {
            userRoles: true,
          },
        },
      },
    })

    if (!role) {
      return NextResponse.json(
        { error: 'Rôle non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(role)
  } catch (error) {
    console.error('Erreur lors de la récupération du rôle:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour un rôle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hasAccess = await checkPermission(PERMISSIONS.ADMIN_ROLES)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, permissionIds } = body

    const existingRole = await prisma.role.findUnique({
      where: { id: params.id },
    })

    if (!existingRole) {
      return NextResponse.json(
        { error: 'Rôle non trouvé' },
        { status: 404 }
      )
    }

    if (existingRole.isSystem) {
      return NextResponse.json(
        { error: 'Les rôles système ne peuvent pas être modifiés' },
        { status: 400 }
      )
    }

    // Vérifier si le nouveau nom existe déjà (sauf pour ce rôle)
    if (name && name.trim() !== existingRole.name) {
      const nameExists = await prisma.role.findFirst({
        where: {
          name: name.trim(),
          id: { not: params.id },
        },
      })

      if (nameExists) {
        return NextResponse.json(
          { error: 'Un rôle avec ce nom existe déjà' },
          { status: 400 }
        )
      }
    }

    // Mettre à jour le rôle
    const role = await prisma.$transaction(async (tx) => {
      // Supprimer les anciennes permissions
      await tx.rolePermission.deleteMany({
        where: { roleId: params.id },
      })

      // Mettre à jour le rôle et créer les nouvelles permissions
      return await tx.role.update({
        where: { id: params.id },
        data: {
          name: name?.trim() || existingRole.name,
          description: description !== undefined ? description?.trim() || null : existingRole.description,
          permissions: {
            create: (permissionIds || []).map((permissionId: string) => ({
              permissionId,
            })),
          },
        },
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
          _count: {
            select: {
              userRoles: true,
            },
          },
        },
      })
    })

    return NextResponse.json(role)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du rôle:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un rôle
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hasAccess = await checkPermission(PERMISSIONS.ADMIN_ROLES)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const role = await prisma.role.findUnique({
      where: { id: params.id },
    })

    if (!role) {
      return NextResponse.json(
        { error: 'Rôle non trouvé' },
        { status: 404 }
      )
    }

    if (role.isSystem) {
      return NextResponse.json(
        { error: 'Les rôles système ne peuvent pas être supprimés' },
        { status: 400 }
      )
    }

    await prisma.role.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Rôle supprimé avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression du rôle:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}


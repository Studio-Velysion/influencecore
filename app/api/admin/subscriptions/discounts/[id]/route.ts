import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { checkPermission, PERMISSIONS } from '@/lib/permissions'

// PUT - Mettre à jour une réduction
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hasAccess = await checkPermission(PERMISSIONS.ADMIN_ACCESS)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const body = await request.json()
    const {
      code,
      name,
      description,
      type,
      value,
      isActive,
      validFrom,
      validUntil,
      maxUses,
    } = body

    const existingDiscount = await prisma.subscriptionDiscount.findUnique({
      where: { id: params.id },
    })

    if (!existingDiscount) {
      return NextResponse.json(
        { error: 'Réduction non trouvée' },
        { status: 404 }
      )
    }

    // Vérifier si le nouveau code existe déjà (sauf pour cette réduction)
    if (code && code.toUpperCase() !== existingDiscount.code) {
      const codeExists = await prisma.subscriptionDiscount.findFirst({
        where: {
          code: code.toUpperCase(),
          id: { not: params.id },
        },
      })

      if (codeExists) {
        return NextResponse.json(
          { error: 'Un code promo avec ce code existe déjà' },
          { status: 400 }
        )
      }
    }

    const discount = await prisma.subscriptionDiscount.update({
      where: { id: params.id },
      data: {
        code: code !== undefined ? (code ? code.toUpperCase() : null) : existingDiscount.code,
        name: name !== undefined ? name : existingDiscount.name,
        description: description !== undefined ? description : existingDiscount.description,
        type: type || existingDiscount.type,
        value: value !== undefined ? value : existingDiscount.value,
        isActive: isActive !== undefined ? isActive : existingDiscount.isActive,
        validFrom: validFrom !== undefined ? (validFrom ? new Date(validFrom) : null) : existingDiscount.validFrom,
        validUntil: validUntil !== undefined ? (validUntil ? new Date(validUntil) : null) : existingDiscount.validUntil,
        maxUses: maxUses !== undefined ? maxUses : existingDiscount.maxUses,
      },
      include: {
        plan: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })

    return NextResponse.json(discount)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la réduction:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une réduction
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hasAccess = await checkPermission(PERMISSIONS.ADMIN_ACCESS)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    await prisma.subscriptionDiscount.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Réduction supprimée avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression de la réduction:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}


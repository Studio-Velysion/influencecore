import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { checkPermission, PERMISSIONS } from '@/lib/permissions'

// GET - Récupérer un plan spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hasAccess = await checkPermission(PERMISSIONS.ADMIN_ACCESS)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: params.id },
      include: {
        discounts: true,
        _count: {
          select: {
            subscriptions: true,
          },
        },
      },
    })

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(plan)
  } catch (error) {
    console.error('Erreur lors de la récupération du plan:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour un plan
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
      name,
      slug,
      description,
      price,
      currency,
      interval,
      features,
      isActive,
      isUnlimited,
      displayOrder,
    } = body

    const existingPlan = await prisma.subscriptionPlan.findUnique({
      where: { id: params.id },
    })

    if (!existingPlan) {
      return NextResponse.json(
        { error: 'Plan non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier si le nouveau slug existe déjà (sauf pour ce plan)
    if (slug && slug.toLowerCase() !== existingPlan.slug) {
      const slugExists = await prisma.subscriptionPlan.findFirst({
        where: {
          slug: slug.toLowerCase(),
          id: { not: params.id },
        },
      })

      if (slugExists) {
        return NextResponse.json(
          { error: 'Un plan avec ce slug existe déjà' },
          { status: 400 }
        )
      }
    }

    const plan = await prisma.subscriptionPlan.update({
      where: { id: params.id },
      data: {
        name: name !== undefined ? name : existingPlan.name,
        slug: slug ? slug.toLowerCase() : existingPlan.slug,
        description: description !== undefined ? description : existingPlan.description,
        price: price !== undefined ? price : existingPlan.price,
        currency: currency || existingPlan.currency,
        interval: interval || existingPlan.interval,
        features: features !== undefined ? features : existingPlan.features,
        isActive: isActive !== undefined ? isActive : existingPlan.isActive,
        isUnlimited: isUnlimited !== undefined ? isUnlimited : existingPlan.isUnlimited,
        displayOrder: displayOrder !== undefined ? displayOrder : existingPlan.displayOrder,
      },
      include: {
        discounts: true,
        _count: {
          select: {
            subscriptions: true,
          },
        },
      },
    })

    return NextResponse.json(plan)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du plan:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un plan
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hasAccess = await checkPermission(PERMISSIONS.ADMIN_ACCESS)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            subscriptions: true,
          },
        },
      },
    })

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan non trouvé' },
        { status: 404 }
      )
    }

    if (plan._count.subscriptions > 0) {
      return NextResponse.json(
        { error: 'Ce plan a des abonnements actifs. Impossible de le supprimer.' },
        { status: 400 }
      )
    }

    await prisma.subscriptionPlan.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Plan supprimé avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression du plan:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}


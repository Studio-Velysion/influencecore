import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { checkPermission, PERMISSIONS } from '@/lib/permissions'

// GET - Récupérer tous les plans
export async function GET(request: NextRequest) {
  try {
    const hasAccess = await checkPermission(PERMISSIONS.ADMIN_ACCESS)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const plans = await prisma.subscriptionPlan.findMany({
      include: {
        discounts: {
          where: { isActive: true },
        },
        _count: {
          select: {
            subscriptions: true,
          },
        },
      },
      orderBy: {
        displayOrder: 'asc',
      },
    })

    return NextResponse.json(plans)
  } catch (error) {
    console.error('Erreur lors de la récupération des plans:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST - Créer un nouveau plan
export async function POST(request: NextRequest) {
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

    if (!name || !slug || price === undefined) {
      return NextResponse.json(
        { error: 'Nom, slug et prix sont requis' },
        { status: 400 }
      )
    }

    // Vérifier si le slug existe déjà
    const existingPlan = await prisma.subscriptionPlan.findUnique({
      where: { slug: slug.toLowerCase() },
    })

    if (existingPlan) {
      return NextResponse.json(
        { error: 'Un plan avec ce slug existe déjà' },
        { status: 400 }
      )
    }

    const plan = await prisma.subscriptionPlan.create({
      data: {
        name,
        slug: slug.toLowerCase(),
        description: description || null,
        price,
        currency: currency || 'EUR',
        interval: interval || 'month',
        features: features || [],
        isActive: isActive !== undefined ? isActive : true,
        isUnlimited: isUnlimited || false,
        displayOrder: displayOrder || 0,
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

    return NextResponse.json(plan, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du plan:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}


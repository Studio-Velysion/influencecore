import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { checkPermission, PERMISSIONS } from '@/lib/permissions'

// POST - Attribuer un abonnement à un utilisateur
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const hasAccess = await checkPermission(PERMISSIONS.ADMIN_ACCESS)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const body = await request.json()
    const { planId, isUnlimited, expiresAt } = body

    if (!planId && !isUnlimited) {
      return NextResponse.json(
        { error: 'planId ou isUnlimited requis' },
        { status: 400 }
      )
    }

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: params.userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Si abonnement illimité
    if (isUnlimited) {
      // Annuler les autres abonnements actifs
      await prisma.userSubscription.updateMany({
        where: {
          userId: params.userId,
          status: 'active',
        },
        data: {
          status: 'cancelled',
          cancelledAt: new Date(),
        },
      })

      // Créer l'abonnement illimité
      const subscription = await prisma.userSubscription.create({
        data: {
          userId: params.userId,
          planId: planId || (await prisma.subscriptionPlan.findFirst({ where: { isUnlimited: true } }))?.id || '',
          status: 'unlimited',
          isUnlimited: true,
          pricePaid: null,
          expiresAt: null,
        },
        include: {
          plan: true,
        },
      })

      return NextResponse.json(subscription, { status: 201 })
    }

    // Vérifier que le plan existe
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    })

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan non trouvé' },
        { status: 404 }
      )
    }

    // Annuler les autres abonnements actifs
    await prisma.userSubscription.updateMany({
      where: {
        userId: params.userId,
        status: 'active',
      },
      data: {
        status: 'cancelled',
        cancelledAt: new Date(),
      },
    })

    // Créer le nouvel abonnement
    const subscription = await prisma.userSubscription.create({
      data: {
        userId: params.userId,
        planId: planId,
        status: 'active',
        isUnlimited: false,
        pricePaid: null, // Gratuit car attribué manuellement
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
      include: {
        plan: true,
      },
    })

    return NextResponse.json(subscription, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de l\'attribution de l\'abonnement:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// GET - Récupérer les abonnements d'un utilisateur
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const hasAccess = await checkPermission(PERMISSIONS.ADMIN_ACCESS)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const subscriptions = await prisma.userSubscription.findMany({
      where: { userId: params.userId },
      include: {
        plan: true,
        discount: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(subscriptions)
  } catch (error) {
    console.error('Erreur lors de la récupération des abonnements:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}


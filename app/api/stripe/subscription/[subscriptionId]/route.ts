import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { cancelStripeSubscription, reactivateStripeSubscription } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

// PUT - Annuler ou réactiver un abonnement
export async function PUT(
  request: NextRequest,
  { params }: { params: { subscriptionId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const { action } = body // 'cancel' ou 'reactivate'

    // Vérifier que l'abonnement appartient à l'utilisateur
    const subscription = await prisma.userSubscription.findFirst({
      where: {
        stripeSubscriptionId: params.subscriptionId,
        userId: session.user.id,
      },
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'Abonnement non trouvé' },
        { status: 404 }
      )
    }

    if (action === 'cancel') {
      await cancelStripeSubscription(params.subscriptionId, true)
      await prisma.userSubscription.update({
        where: { id: subscription.id },
        data: {
          cancelAtPeriodEnd: true,
        },
      })
      return NextResponse.json({ message: 'Abonnement annulé à la fin de la période' })
    } else if (action === 'reactivate') {
      await reactivateStripeSubscription(params.subscriptionId)
      await prisma.userSubscription.update({
        where: { id: subscription.id },
        data: {
          cancelAtPeriodEnd: false,
        },
      })
      return NextResponse.json({ message: 'Abonnement réactivé' })
    } else {
      return NextResponse.json(
        { error: 'Action invalide' },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('Erreur lors de la gestion de l\'abonnement:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}


import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

// Désactiver le parsing du body pour les webhooks Stripe
export const runtime = 'nodejs'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

if (!webhookSecret) {
  throw new Error('STRIPE_WEBHOOK_SECRET is not set')
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('Erreur de signature webhook:', err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.mode === 'subscription') {
          const subscriptionId = session.subscription as string
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)

          await handleSubscriptionCreated(subscription, session)
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdated(subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentSucceeded(invoice)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(invoice)
        break
      }

      default:
        console.log(`Événement non géré: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Erreur lors du traitement du webhook:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// Gérer la création d'un abonnement
async function handleSubscriptionCreated(
  subscription: Stripe.Subscription,
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.userId || subscription.metadata?.userId
  const planId = session.metadata?.planId || subscription.metadata?.planId

  if (!userId || !planId) {
    console.error('userId ou planId manquant dans les métadonnées')
    return
  }

  const priceId = subscription.items.data[0]?.price.id
  const customerId = subscription.customer as string

  // Annuler les autres abonnements actifs
  await prisma.userSubscription.updateMany({
    where: {
      userId,
      status: 'active',
    },
    data: {
      status: 'cancelled',
      cancelledAt: new Date(),
    },
  })

  // Créer le nouvel abonnement
  await prisma.userSubscription.create({
    data: {
      userId,
      planId,
      status: 'active',
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: customerId,
      stripePriceId: priceId,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      startedAt: new Date(subscription.created * 1000),
    },
  })
}

// Gérer la mise à jour d'un abonnement
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const existingSubscription = await prisma.userSubscription.findUnique({
    where: {
      stripeSubscriptionId: subscription.id,
    },
  })

  if (!existingSubscription) {
    console.error('Abonnement non trouvé:', subscription.id)
    return
  }

  let status = 'active'
  if (subscription.status === 'canceled') {
    status = 'cancelled'
  } else if (subscription.status === 'past_due') {
    status = 'past_due'
  } else if (subscription.status === 'trialing') {
    status = 'trialing'
  } else if (subscription.status === 'unpaid') {
    status = 'expired'
  }

  await prisma.userSubscription.update({
    where: {
      id: existingSubscription.id,
    },
    data: {
      status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      cancelledAt: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000)
        : null,
    },
  })
}

// Gérer la suppression d'un abonnement
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await prisma.userSubscription.updateMany({
    where: {
      stripeSubscriptionId: subscription.id,
    },
    data: {
      status: 'cancelled',
      cancelledAt: new Date(),
    },
  })
}

// Gérer un paiement réussi
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string

  if (subscriptionId) {
    const subscription = await prisma.userSubscription.findUnique({
      where: {
        stripeSubscriptionId: subscriptionId,
      },
    })

    if (subscription) {
      await prisma.userSubscription.update({
        where: {
          id: subscription.id,
        },
        data: {
          status: 'active',
          currentPeriodStart: invoice.period_start
            ? new Date(invoice.period_start * 1000)
            : undefined,
          currentPeriodEnd: invoice.period_end
            ? new Date(invoice.period_end * 1000)
            : undefined,
        },
      })
    }
  }
}

// Gérer un paiement échoué
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string

  if (subscriptionId) {
    await prisma.userSubscription.updateMany({
      where: {
        stripeSubscriptionId: subscriptionId,
      },
      data: {
        status: 'past_due',
      },
    })
  }
}


// Configuration et utilitaires Stripe

import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
})

// Créer ou récupérer un client Stripe
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string | null
): Promise<string> {
  const { prisma } = await import('@/lib/prisma')

  // Vérifier si l'utilisateur a déjà un customer_id
  const existingSubscription = await prisma.userSubscription.findFirst({
    where: {
      userId,
      stripeCustomerId: { not: null },
    },
    select: {
      stripeCustomerId: true,
    },
  })

  if (existingSubscription?.stripeCustomerId) {
    return existingSubscription.stripeCustomerId
  }

  // Créer un nouveau client Stripe
  const customer = await stripe.customers.create({
    email,
    name: name || undefined,
    metadata: {
      userId,
    },
  })

  return customer.id
}

// Créer ou récupérer un produit Stripe
export async function getOrCreateStripeProduct(
  planId: string,
  name: string,
  description?: string | null
): Promise<string> {
  const { prisma } = await import('@/lib/prisma')

  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: planId },
    select: {
      stripeProductId: true,
    },
  })

  if (plan?.stripeProductId) {
    return plan.stripeProductId
  }

  // Créer un nouveau produit Stripe
  const product = await stripe.products.create({
    name,
    description: description || undefined,
    metadata: {
      planId,
    },
  })

  // Mettre à jour le plan avec le product_id
  await prisma.subscriptionPlan.update({
    where: { id: planId },
    data: {
      stripeProductId: product.id,
    },
  })

  return product.id
}

// Créer ou récupérer un prix Stripe
export async function getOrCreateStripePrice(
  planId: string,
  amount: number,
  currency: string,
  interval: 'month' | 'year'
): Promise<string> {
  const { prisma } = await import('@/lib/prisma')

  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: planId },
    select: {
      stripePriceId: true,
      stripeProductId: true,
      name: true,
      description: true,
    },
  })

  if (plan?.stripePriceId) {
    return plan.stripePriceId
  }

  if (!plan?.stripeProductId) {
    // Créer le produit si nécessaire
    await getOrCreateStripeProduct(planId, plan.name, plan.description)
    // Recharger le plan
    const updatedPlan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
      select: {
        stripeProductId: true,
      },
    })
    if (!updatedPlan?.stripeProductId) {
      throw new Error('Failed to create Stripe product')
    }
  }

  // Créer un nouveau prix Stripe
  const price = await stripe.prices.create({
    product: plan.stripeProductId!,
    unit_amount: Math.round(amount * 100), // Convertir en centimes
    currency: currency.toLowerCase(),
    recurring: {
      interval: interval === 'month' ? 'month' : 'year',
    },
    metadata: {
      planId,
    },
  })

  // Mettre à jour le plan avec le price_id
  await prisma.subscriptionPlan.update({
    where: { id: planId },
    data: {
      stripePriceId: price.id,
    },
  })

  return price.id
}

// Créer une session de checkout Stripe
export async function createCheckoutSession(
  userId: string,
  planId: string,
  successUrl: string,
  cancelUrl: string,
  discountCode?: string
): Promise<string> {
  const { prisma } = await import('@/lib/prisma')
  const { getPlanCurrentPrice } = await import('@/lib/subscriptions')

  // Récupérer le plan
  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: planId },
  })

  if (!plan) {
    throw new Error('Plan not found')
  }

  if (plan.isUnlimited) {
    throw new Error('Unlimited plans cannot be purchased')
  }

  // Récupérer l'utilisateur
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new Error('User not found')
  }

  // Obtenir le prix avec réduction
  const priceInfo = await getPlanCurrentPrice(planId, discountCode)

  // Créer ou récupérer le client Stripe
  const customerId = await getOrCreateStripeCustomer(
    userId,
    user.email,
    user.name
  )

  // Créer ou récupérer le prix Stripe
  const stripePriceId = await getOrCreateStripePrice(
    planId,
    priceInfo.final,
    plan.currency,
    plan.interval as 'month' | 'year'
  )

  // Créer la session de checkout
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: stripePriceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      planId,
      discountCode: discountCode || '',
    },
    subscription_data: {
      metadata: {
        userId,
        planId,
      },
    },
  })

  return session.url || session.id
}

// Annuler un abonnement Stripe
export async function cancelStripeSubscription(
  subscriptionId: string,
  cancelAtPeriodEnd: boolean = true
): Promise<void> {
  if (cancelAtPeriodEnd) {
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })
  } else {
    await stripe.subscriptions.cancel(subscriptionId)
  }
}

// Réactiver un abonnement Stripe
export async function reactivateStripeSubscription(
  subscriptionId: string
): Promise<void> {
  await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  })
}


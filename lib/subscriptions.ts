// Utilitaires pour les abonnements

import { prisma } from '@/lib/prisma'
import { SubscriptionPlan, SubscriptionDiscount, SubscriptionPrice } from '@/types/subscriptions'

// Calculer le prix final avec les réductions
export function calculatePrice(
  plan: SubscriptionPlan | { price: number | string; currency: string },
  discount?: SubscriptionDiscount | null
): SubscriptionPrice {
  const original = typeof plan.price === 'string' ? parseFloat(plan.price) : plan.price
  let discounted: number | null = null
  let final = original

  if (discount && discount.isActive) {
    if (discount.type === 'percentage') {
      discounted = original * (1 - Number(discount.value) / 100)
      final = discounted
    } else if (discount.type === 'fixed') {
      discounted = Math.max(0, original - Number(discount.value))
      final = discounted
    }
  }

  return {
    original,
    discounted,
    discount: discount || null,
    final,
    currency: plan.currency,
  }
}

// Obtenir le prix actuel d'un plan avec toutes les réductions actives
export async function getPlanCurrentPrice(
  planId: string,
  discountCode?: string
): Promise<SubscriptionPrice> {
  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: planId },
    include: {
      discounts: {
        where: {
          isActive: true,
          OR: [
            { validFrom: null },
            { validFrom: { lte: new Date() } },
          ],
          AND: [
            {
              OR: [
                { validUntil: null },
                { validUntil: { gte: new Date() } },
              ],
            },
          ],
        },
      },
    },
  })

  if (!plan) {
    throw new Error('Plan non trouvé')
  }

  // Si un code promo est fourni, chercher la réduction correspondante
  let activeDiscount: SubscriptionDiscount | null = null

  if (discountCode) {
    const discount = await prisma.subscriptionDiscount.findFirst({
      where: {
        planId: plan.id,
        code: discountCode.toUpperCase(),
        isActive: true,
        OR: [
          { maxUses: null },
          { currentUses: { lt: prisma.subscriptionDiscount.fields.maxUses } },
        ],
      },
    })

    if (discount) {
      activeDiscount = discount as any
    }
  } else {
    // Sinon, prendre la première réduction active
    if (plan.discounts && plan.discounts.length > 0) {
      activeDiscount = plan.discounts[0] as any
    }
  }

  return calculatePrice(plan as any, activeDiscount)
}

// Vérifier si un utilisateur a un abonnement actif
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const subscription = await prisma.userSubscription.findFirst({
    where: {
      userId,
      status: {
        in: ['active', 'unlimited'],
      },
      OR: [
        { expiresAt: null },
        { expiresAt: { gte: new Date() } },
      ],
    },
  })

  return !!subscription
}

// Obtenir l'abonnement actif d'un utilisateur
export async function getActiveSubscription(userId: string) {
  return await prisma.userSubscription.findFirst({
    where: {
      userId,
      status: {
        in: ['active', 'unlimited'],
      },
      OR: [
        { expiresAt: null },
        { expiresAt: { gte: new Date() } },
      ],
    },
    include: {
      plan: true,
      discount: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

// Vérifier si un utilisateur a un abonnement illimité
export async function hasUnlimitedSubscription(userId: string): Promise<boolean> {
  const subscription = await prisma.userSubscription.findFirst({
    where: {
      userId,
      status: 'unlimited',
      isUnlimited: true,
    },
  })

  return !!subscription
}


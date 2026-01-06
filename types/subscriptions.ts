export interface SubscriptionPlan {
  id: string
  name: string
  slug: string
  description?: string | null
  price: string
  currency: string
  interval: string
  features?: string | null
  permissions?: string | null
  isActive: boolean
  isUnlimited: boolean
  displayOrder: number
  stripePriceId?: string | null
  stripeProductId?: string | null
  createdAt: string
  updatedAt: string
}

export interface SubscriptionDiscount {
  id: string
  planId?: string | null
  code: string
  name: string
  description?: string | null
  type: string
  value: string
  isActive: boolean
  validFrom?: string | null
  validUntil?: string | null
  maxUses?: number | null
  currentUses: number
  oneTimePerClient: boolean
  applicableToFirstPayment: boolean
  applicableToRenewals: boolean
  createdAt: string
  updatedAt: string
}

export interface UserSubscription {
  id: string
  userId: string
  planId: string
  status: string
  isUnlimited: boolean
  pricePaid?: string | null
  discountId?: string | null
  startedAt: string
  expiresAt?: string | null
  nextBillingDate?: string | null
  cancelledAt?: string | null
  suspendedAt?: string | null
  pausedAt?: string | null
  stripeSubscriptionId?: string | null
  stripeCustomerId?: string | null
  stripePriceId?: string | null
  stripePaymentIntentId?: string | null
  currentPeriodStart?: string | null
  currentPeriodEnd?: string | null
  cancelAtPeriodEnd: boolean
  createdAt: string
  updatedAt: string
}



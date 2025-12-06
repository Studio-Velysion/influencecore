export interface SubscriptionPlan {
  id: string
  name: string
  slug: string
  description: string | null
  price: number | string
  currency: string
  interval: string
  features: any
  isActive: boolean
  isUnlimited: boolean
  displayOrder: number
  createdAt: string
  updatedAt: string
  discounts?: SubscriptionDiscount[]
  priceInfo?: SubscriptionPrice
  _count?: {
    subscriptions: number
  }
}

export interface SubscriptionDiscount {
  id: string
  planId: string
  code: string | null
  name: string
  description: string | null
  type: 'percentage' | 'fixed'
  value: number
  isActive: boolean
  validFrom: string | null
  validUntil: string | null
  maxUses: number | null
  currentUses: number
  createdAt: string
  updatedAt: string
  plan?: SubscriptionPlan
}

export interface UserSubscription {
  id: string
  userId: string
  planId: string
  status: 'active' | 'cancelled' | 'expired' | 'unlimited'
  isUnlimited: boolean
  pricePaid: number | null
  discountId: string | null
  startedAt: string
  expiresAt: string | null
  cancelledAt: string | null
  createdAt: string
  updatedAt: string
  plan?: SubscriptionPlan
  discount?: SubscriptionDiscount | null
}

export interface SubscriptionPrice {
  original: number
  discounted: number | null
  discount: SubscriptionDiscount | null
  final: number
  currency: string
}


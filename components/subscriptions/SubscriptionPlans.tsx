'use client'

import { SubscriptionPlan } from '@/types/subscriptions'
import Button from '@/components/common/Button'
import Badge from '@/components/common/Badge'

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[]
}

export default function SubscriptionPlans({ plans }: SubscriptionPlansProps) {
  if (plans.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Aucun plan d'abonnement disponible pour le moment.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {plans.map((plan) => {
        const priceInfo = plan.priceInfo
        const hasDiscount = priceInfo && priceInfo.discounted !== null
        const features = Array.isArray(plan.features) ? plan.features : []

        return (
          <div
            key={plan.id}
            className={`bg-white rounded-lg shadow-lg p-8 relative ${
              plan.isUnlimited ? 'ring-2 ring-yellow-400' : ''
            }`}
          >
            {plan.isUnlimited && (
              <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-bl-lg text-sm font-semibold">
                👑 Illimité
              </div>
            )}

            {hasDiscount && priceInfo?.discount && (
              <div className="absolute top-0 left-0 bg-red-500 text-white px-3 py-1 rounded-br-lg text-sm font-semibold">
                -{priceInfo.discount.type === 'percentage'
                  ? `${priceInfo.discount.value}%`
                  : `${priceInfo.discount.value}€`}
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              {plan.description && (
                <p className="text-gray-600 text-sm">{plan.description}</p>
              )}
            </div>

            <div className="mb-6">
              {plan.isUnlimited ? (
                <div className="text-4xl font-bold text-gray-900">Gratuit</div>
              ) : (
                <div>
                  {hasDiscount && priceInfo ? (
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl text-gray-400 line-through">
                          {priceInfo.original}€
                        </span>
                        <span className="text-4xl font-bold text-gray-900">
                          {priceInfo.final.toFixed(2)}€
                        </span>
                      </div>
                      {priceInfo.discount && (
                        <p className="text-sm text-green-600 mt-1">
                          Économisez {(
                            priceInfo.original - priceInfo.final
                          ).toFixed(2)}€
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-4xl font-bold text-gray-900">
                      {plan.price}€
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    /{plan.interval === 'month' ? 'mois' : 'an'}
                  </p>
                </div>
              )}
            </div>

            {features.length > 0 && (
              <ul className="space-y-3 mb-8">
                {features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            )}

            <Button
              variant="primary"
              className="w-full"
              onClick={async () => {
                if (plan.isUnlimited) {
                  alert('Les plans illimités doivent être attribués par un administrateur')
                  return
                }

                try {
                  const response = await fetch('/api/stripe/checkout', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      planId: plan.id,
                    }),
                  })

                  if (!response.ok) {
                    const data = await response.json()
                    throw new Error(data.error || 'Une erreur est survenue')
                  }

                  const { url } = await response.json()
                  if (url) {
                    window.location.href = url
                  }
                } catch (error: any) {
                  alert(`Erreur: ${error.message}`)
                }
              }}
            >
              {plan.isUnlimited ? 'Activer gratuitement' : 'S\'abonner'}
            </Button>
          </div>
        )
      })}
    </div>
  )
}


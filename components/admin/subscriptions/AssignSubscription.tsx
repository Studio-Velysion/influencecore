'use client'

import { useState } from 'react'
import { SubscriptionPlan, AdminUser } from '@/types/subscriptions'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'
import { handleApiError, handleApiSuccess } from '@/lib/api'

interface AssignSubscriptionProps {
  user: AdminUser
  plans: SubscriptionPlan[]
  onSuccess: () => void
  onCancel: () => void
}

export default function AssignSubscription({
  user,
  plans,
  onSuccess,
  onCancel,
}: AssignSubscriptionProps) {
  const [planId, setPlanId] = useState('')
  const [isUnlimited, setIsUnlimited] = useState(false)
  const [expiresAt, setExpiresAt] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isUnlimited && !planId) {
      handleApiError({ error: 'Sélectionnez un plan ou activez l\'abonnement illimité' } as any)
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/subscriptions/users/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: isUnlimited ? null : planId,
          isUnlimited,
          expiresAt: expiresAt || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Une erreur est survenue')
      }

      handleApiSuccess(
        isUnlimited
          ? 'Abonnement illimité attribué avec succès'
          : 'Abonnement attribué avec succès'
      )
      onSuccess()
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Utilisateur :</strong> {user.email}
          {user.name && ` (${user.name})`}
        </p>
      </div>

      <div className="space-y-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isUnlimited}
            onChange={(e) => setIsUnlimited(e.target.checked)}
            className="h-4 w-4 text-primary-600"
          />
          <span className="text-sm font-medium">
            Abonnement illimité (gratuit, sans expiration)
          </span>
        </label>

        {!isUnlimited && (
          <>
            <Select
              label="Plan d'abonnement *"
              options={[
                { value: '', label: 'Sélectionner un plan...' },
                ...plans
                  .filter((p) => p.isActive)
                  .map((plan) => ({
                    value: plan.id,
                    label: `${plan.name} - ${plan.price}${plan.currency === 'EUR' ? '€' : plan.currency}/${plan.interval === 'month' ? 'mois' : 'an'}`,
                  })),
              ]}
              value={planId}
              onChange={(e) => setPlanId(e.target.value)}
              required={!isUnlimited}
            />

            <Input
              label="Date d'expiration (optionnel)"
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              helperText="Laissez vide pour un abonnement sans expiration"
            />
          </>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800">
          ⚠️ <strong>Attention :</strong> Les autres abonnements actifs de cet utilisateur seront automatiquement annulés.
        </p>
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Annuler
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={loading}
          disabled={!isUnlimited && !planId}
        >
          Attribuer l'abonnement
        </Button>
      </div>
    </form>
  )
}


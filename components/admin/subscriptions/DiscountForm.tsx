'use client'

import { useState } from 'react'
import { SubscriptionDiscount, SubscriptionPlan } from '@/types/subscriptions'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Textarea from '@/components/common/Textarea'
import Select from '@/components/common/Select'
import { handleApiError, handleApiSuccess } from '@/lib/api'

interface DiscountFormProps {
  discount?: SubscriptionDiscount | null
  plans: SubscriptionPlan[]
  onSuccess: () => void
  onCancel: () => void
}

export default function DiscountForm({
  discount,
  plans,
  onSuccess,
  onCancel,
}: DiscountFormProps) {
  const [planId, setPlanId] = useState(discount?.planId || '')
  const [code, setCode] = useState(discount?.code || '')
  const [name, setName] = useState(discount?.name || '')
  const [description, setDescription] = useState(discount?.description || '')
  const [type, setType] = useState<'percentage' | 'fixed'>(discount?.type || 'percentage')
  const [value, setValue] = useState(discount?.value?.toString() || '0')
  const [isActive, setIsActive] = useState(discount?.isActive !== undefined ? discount.isActive : true)
  const [validFrom, setValidFrom] = useState(
    discount?.validFrom ? new Date(discount.validFrom).toISOString().split('T')[0] : ''
  )
  const [validUntil, setValidUntil] = useState(
    discount?.validUntil ? new Date(discount.validUntil).toISOString().split('T')[0] : ''
  )
  const [maxUses, setMaxUses] = useState(discount?.maxUses?.toString() || '')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = discount
        ? `/api/admin/subscriptions/discounts/${discount.id}`
        : '/api/admin/subscriptions/discounts'
      const method = discount ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          code: code.trim() || null,
          name,
          description: description || null,
          type,
          value: parseFloat(value),
          isActive,
          validFrom: validFrom || null,
          validUntil: validUntil || null,
          maxUses: maxUses ? parseInt(maxUses) : null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Une erreur est survenue')
      }

      handleApiSuccess(discount ? 'Réduction mise à jour' : 'Réduction créée')
      onSuccess()
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Select
        label="Plan *"
        options={[
          { value: '', label: 'Sélectionner un plan...' },
          ...plans.map((plan) => ({
            value: plan.id,
            label: `${plan.name} (${plan.price}€/${plan.interval === 'month' ? 'mois' : 'an'})`,
          })),
        ]}
        value={planId}
        onChange={(e) => setPlanId(e.target.value)}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Code promo (optionnel)"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="PROMO2024"
          helperText="Laissez vide pour une réduction automatique"
        />
        <Input
          label="Nom de la réduction *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Ex: Réduction de lancement"
        />
      </div>

      <Textarea
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        placeholder="Description de la réduction"
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Type *"
          options={[
            { value: 'percentage', label: 'Pourcentage (%)' },
            { value: 'fixed', label: 'Montant fixe' },
          ]}
          value={type}
          onChange={(e) => setType(e.target.value as 'percentage' | 'fixed')}
          required
        />
        <Input
          label={type === 'percentage' ? 'Pourcentage (%) *' : 'Montant fixe *'}
          type="number"
          step={type === 'percentage' ? '1' : '0.01'}
          min="0"
          max={type === 'percentage' ? '100' : undefined}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Valide à partir de"
          type="date"
          value={validFrom}
          onChange={(e) => setValidFrom(e.target.value)}
        />
        <Input
          label="Valide jusqu'à"
          type="date"
          value={validUntil}
          onChange={(e) => setValidUntil(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Nombre max d'utilisations"
          type="number"
          min="1"
          value={maxUses}
          onChange={(e) => setMaxUses(e.target.value)}
          placeholder="Illimité si vide"
        />
        <div className="flex items-center gap-2 pt-6">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 text-primary-600"
          />
          <label className="text-sm font-medium">Réduction active</label>
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Annuler
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={loading}
          disabled={!planId || !name.trim()}
        >
          {discount ? 'Mettre à jour' : 'Créer la réduction'}
        </Button>
      </div>
    </form>
  )
}


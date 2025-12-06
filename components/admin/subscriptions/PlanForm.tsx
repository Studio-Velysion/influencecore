'use client'

import { useState, useEffect } from 'react'
import { SubscriptionPlan } from '@/types/subscriptions'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Textarea from '@/components/common/Textarea'
import Select from '@/components/common/Select'
import { handleApiError, handleApiSuccess } from '@/lib/api'

interface PlanFormProps {
  plan?: SubscriptionPlan | null
  onSuccess: () => void
  onCancel: () => void
}

export default function PlanForm({
  plan,
  onSuccess,
  onCancel,
}: PlanFormProps) {
  const [name, setName] = useState(plan?.name || '')
  const [slug, setSlug] = useState(plan?.slug || '')
  const [description, setDescription] = useState(plan?.description || '')
  const [price, setPrice] = useState(plan?.price?.toString() || '0')
  const [currency, setCurrency] = useState(plan?.currency || 'EUR')
  const [interval, setInterval] = useState(plan?.interval || 'month')
  const [isActive, setIsActive] = useState(plan?.isActive !== undefined ? plan.isActive : true)
  const [isUnlimited, setIsUnlimited] = useState(plan?.isUnlimited || false)
  const [displayOrder, setDisplayOrder] = useState(plan?.displayOrder?.toString() || '0')
  const [features, setFeatures] = useState<string[]>(
    plan?.features ? (Array.isArray(plan.features) ? plan.features : []) : []
  )
  const [newFeature, setNewFeature] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()])
      setNewFeature('')
    }
  }

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = plan ? `/api/admin/subscriptions/plans/${plan.id}` : '/api/admin/subscriptions/plans'
      const method = plan ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          slug,
          description,
          price: parseFloat(price),
          currency,
          interval,
          features,
          isActive,
          isUnlimited,
          displayOrder: parseInt(displayOrder) || 0,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Une erreur est survenue')
      }

      handleApiSuccess(plan ? 'Plan mis à jour' : 'Plan créé')
      onSuccess()
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Nom du plan *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Ex: Starter, Pro, Premium"
        />
        <Input
          label="Slug *"
          value={slug}
          onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
          required
          placeholder="starter, pro, premium"
          helperText="Identifiant unique (minuscules, tirets)"
        />
      </div>

      <Textarea
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        placeholder="Description du plan"
      />

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Input
            label="Prix *"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            disabled={isUnlimited}
          />
        </div>
        <Select
          label="Devise"
          options={[
            { value: 'EUR', label: 'EUR (€)' },
            { value: 'USD', label: 'USD ($)' },
            { value: 'GBP', label: 'GBP (£)' },
          ]}
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        />
        <Select
          label="Période"
          options={[
            { value: 'month', label: 'Mensuel' },
            { value: 'year', label: 'Annuel' },
          ]}
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 text-primary-600"
            />
            <span className="text-sm font-medium">Plan actif</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isUnlimited}
              onChange={(e) => setIsUnlimited(e.target.checked)}
              className="h-4 w-4 text-primary-600"
            />
            <span className="text-sm font-medium">Plan illimité (gratuit)</span>
          </label>
        </div>
        <Input
          label="Ordre d'affichage"
          type="number"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(e.target.value)}
          helperText="Plus petit = affiché en premier"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fonctionnalités
        </label>
        <div className="space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="flex-1 text-sm text-gray-700">• {feature}</span>
              <button
                type="button"
                onClick={() => handleRemoveFeature(index)}
                className="text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddFeature()
                }
              }}
              placeholder="Ajouter une fonctionnalité"
              className="flex-1"
            />
            <Button type="button" onClick={handleAddFeature} variant="ghost">
              Ajouter
            </Button>
          </div>
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
          disabled={!name.trim() || !slug.trim()}
        >
          {plan ? 'Mettre à jour' : 'Créer le plan'}
        </Button>
      </div>
    </form>
  )
}


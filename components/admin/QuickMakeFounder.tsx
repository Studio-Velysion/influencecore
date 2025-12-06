'use client'

import { useState } from 'react'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { handleApiError, handleApiSuccess } from '@/lib/api'

interface QuickMakeFounderProps {
  onSuccess: () => void
}

export default function QuickMakeFounder({ onSuccess }: QuickMakeFounderProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      handleApiError({ error: 'L\'email est requis' } as any)
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/users/make-founder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Une erreur est survenue')
      }

      handleApiSuccess('Rôle Fondateur attribué avec succès')
      setEmail('')
      onSuccess()
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="text-3xl">👑</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Attribuer le rôle Fondateur
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Le rôle Fondateur donne accès à toutes les fonctionnalités et permissions de la plateforme.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="flex-1"
              required
            />
            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              disabled={!email.trim()}
            >
              Attribuer Fondateur
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}


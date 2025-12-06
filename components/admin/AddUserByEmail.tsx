'use client'

import { useState } from 'react'
import { Role } from '@/types/admin'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'
import { handleApiError, handleApiSuccess } from '@/lib/api'

interface AddUserByEmailProps {
  roles: Role[]
  onSuccess: () => void
  onCancel: () => void
}

export default function AddUserByEmail({
  roles,
  onSuccess,
  onCancel,
}: AddUserByEmailProps) {
  const [email, setEmail] = useState('')
  const [selectedRoleId, setSelectedRoleId] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      handleApiError({ error: 'L\'email est requis' } as any)
      return
    }

    if (!selectedRoleId) {
      handleApiError({ error: 'Un rôle doit être sélectionné' } as any)
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/users/by-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          roleId: selectedRoleId,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Une erreur est survenue')
      }

      const result = await response.json()
      handleApiSuccess(
        result.userCreated
          ? 'Utilisateur créé et rôle attribué avec succès'
          : 'Rôle attribué avec succès'
      )
      setEmail('')
      setSelectedRoleId('')
      onSuccess()
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email de l'utilisateur *"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="utilisateur@example.com"
        helperText="Si l'utilisateur n'existe pas, un compte sera créé automatiquement"
      />

      <Select
        label="Rôle à attribuer *"
        options={[
          { value: '', label: 'Sélectionner un rôle...' },
          ...roles.map((role) => ({
            value: role.id,
            label: role.name,
          })),
        ]}
        value={selectedRoleId}
        onChange={(e) => setSelectedRoleId(e.target.value)}
        required
      />

      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Annuler
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={loading}
          disabled={!email.trim() || !selectedRoleId}
        >
          Attribuer le rôle
        </Button>
      </div>
    </form>
  )
}


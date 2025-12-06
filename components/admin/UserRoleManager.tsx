'use client'

import { useState, useEffect } from 'react'
import { AdminUser, Role } from '@/types/admin'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'
import Badge from '@/components/common/Badge'
import { handleApiError, handleApiSuccess } from '@/lib/api'
import toast from 'react-hot-toast'

interface UserRoleManagerProps {
  user: AdminUser
  roles: Role[]
  onUpdate: () => void
}

export default function UserRoleManager({
  user,
  roles,
  onUpdate,
}: UserRoleManagerProps) {
  const [selectedRoleId, setSelectedRoleId] = useState('')
  const [loading, setLoading] = useState(false)
  const [userRoles, setUserRoles] = useState(user.userRoles || [])

  const availableRoles = roles.filter(
    (role) => !userRoles.some((ur) => ur.role.id === role.id)
  )

  const isFounder = userRoles.some((ur) => ur.role.name === 'Fondateur')

  const handleAddRole = async () => {
    if (!selectedRoleId) {
      toast.error('Sélectionnez un rôle')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${user.id}/roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roleId: selectedRoleId }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Une erreur est survenue')
      }

      handleApiSuccess('Rôle attribué avec succès')
      setSelectedRoleId('')
      onUpdate()
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveRole = async (roleId: string) => {
    const role = roles.find((r) => r.id === roleId)
    if (role?.name === 'Fondateur') {
      toast.error('Le rôle Fondateur ne peut pas être retiré')
      return
    }

    if (!confirm('Êtes-vous sûr de vouloir retirer ce rôle ?')) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(
        `/api/admin/users/${user.id}/roles?roleId=${roleId}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Une erreur est survenue')
      }

      handleApiSuccess('Rôle retiré avec succès')
      onUpdate()
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setUserRoles(user.userRoles || [])
  }, [user])

  return (
    <div className="space-y-4">
      {isFounder && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-amber-800">
            ⭐ Cet utilisateur a le rôle <strong>Fondateur</strong> avec toutes les permissions
          </p>
        </div>
      )}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Rôles attribués
        </h4>
        {userRoles.length === 0 ? (
          <p className="text-sm text-gray-500">Aucun rôle attribué</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {userRoles.map((userRole) => {
              const isFounderRole = userRole.role.name === 'Fondateur'
              return (
                <Badge
                  key={userRole.id}
                  variant={isFounderRole ? 'warning' : 'info'}
                  className="flex items-center gap-2"
                >
                  {isFounderRole && '👑 '}
                  {userRole.role.name}
                  {!isFounderRole && (
                    <button
                      onClick={() => handleRemoveRole(userRole.role.id)}
                      disabled={loading}
                      className="text-blue-800 hover:text-blue-900"
                    >
                      ✕
                    </button>
                  )}
                </Badge>
              )
            })}
          </div>
        )}
      </div>

      {availableRoles.length > 0 && (
        <div className="flex gap-2">
          <Select
            label=""
            options={[
              { value: '', label: 'Sélectionner un rôle...' },
              ...availableRoles.map((role) => ({
                value: role.id,
                label: role.name,
              })),
            ]}
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={handleAddRole}
            disabled={!selectedRoleId || loading}
            isLoading={loading}
            variant="primary"
          >
            Ajouter
          </Button>
        </div>
      )}
    </div>
  )
}


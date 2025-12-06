'use client'

import { useState, useEffect } from 'react'
import { Role, Permission } from '@/types/admin'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Textarea from '@/components/common/Textarea'
import { handleApiError, handleApiSuccess } from '@/lib/api'
import toast from 'react-hot-toast'

interface RoleFormProps {
  role?: Role | null
  permissions: Permission[]
  onSuccess: () => void
  onCancel: () => void
}

export default function RoleForm({
  role,
  permissions,
  onSuccess,
  onCancel,
}: RoleFormProps) {
  const [name, setName] = useState(role?.name || '')
  const [description, setDescription] = useState(role?.description || '')
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set(role?.permissions?.map((rp) => rp.permission.id) || [])
  )
  const [loading, setLoading] = useState(false)

  const permissionsByCategory = permissions.reduce((acc, perm) => {
    const category = perm.category || 'Autre'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(perm)
    return acc
  }, {} as Record<string, Permission[]>)

  const togglePermission = (permissionId: string) => {
    const newSelected = new Set(selectedPermissions)
    if (newSelected.has(permissionId)) {
      newSelected.delete(permissionId)
    } else {
      newSelected.add(permissionId)
    }
    setSelectedPermissions(newSelected)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = role ? `/api/admin/roles/${role.id}` : '/api/admin/roles'
      const method = role ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          permissionIds: Array.from(selectedPermissions),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Une erreur est survenue')
      }

      handleApiSuccess(role ? 'Rôle mis à jour' : 'Rôle créé')
      onSuccess()
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Nom du rôle *"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        disabled={role?.isSystem}
        placeholder="Ex: Éditeur, Modérateur, Contributeur"
      />

      <Textarea
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        placeholder="Description du rôle et de ses responsabilités"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Permissions *
        </label>
        <div className="space-y-4 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
          {Object.entries(permissionsByCategory).map(([category, perms]) => (
            <div key={category} className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-900 capitalize">
                {category}
              </h4>
              <div className="space-y-2 pl-4">
                {perms.map((permission) => (
                  <label
                    key={permission.id}
                    className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPermissions.has(permission.id)}
                      onChange={() => togglePermission(permission.id)}
                      disabled={role?.isSystem}
                      className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {permission.name}
                      </div>
                      {permission.description && (
                        <div className="text-xs text-gray-500">
                          {permission.description}
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        {selectedPermissions.size === 0 && (
          <p className="mt-2 text-sm text-amber-600">
            ⚠️ Sélectionnez au moins une permission
          </p>
        )}
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Annuler
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={loading}
          disabled={!name.trim() || selectedPermissions.size === 0 || role?.isSystem}
        >
          {role ? 'Mettre à jour' : 'Créer le rôle'}
        </Button>
      </div>
    </form>
  )
}


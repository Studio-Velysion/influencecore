'use client'

import { useState, useEffect } from 'react'
import { Role, Permission } from '@/types/admin'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import RoleForm from './RoleForm'
import Badge from '@/components/common/Badge'
import { handleApiError, handleApiSuccess } from '@/lib/api'
import { formatNumber } from '@/lib/utils'

interface RolesListProps {
  onUpdate?: () => void
}

export default function RolesList({ onUpdate }: RolesListProps) {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<Role | null>(null)

  const fetchData = async () => {
    try {
      const [rolesRes, permissionsRes] = await Promise.all([
        fetch('/api/admin/roles'),
        fetch('/api/admin/permissions'),
      ])

      if (rolesRes.ok) {
        const rolesData = await rolesRes.json()
        setRoles(rolesData)
      }

      if (permissionsRes.ok) {
        const permissionsData = await permissionsRes.json()
        setPermissions(permissionsData)
      }
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCreate = () => {
    setEditingRole(null)
    setIsFormOpen(true)
  }

  const handleEdit = (role: Role) => {
    setEditingRole(role)
    setIsFormOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteConfirm) return

    try {
      const response = await fetch(`/api/admin/roles/${deleteConfirm.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Une erreur est survenue')
      }

      handleApiSuccess('Rôle supprimé avec succès')
      setDeleteConfirm(null)
      fetchData()
      if (onUpdate) onUpdate()
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleFormSuccess = () => {
    setIsFormOpen(false)
    setEditingRole(null)
    fetchData()
    if (onUpdate) onUpdate()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Rôles</h3>
        <Button onClick={handleCreate} variant="primary">
          + Créer un rôle
        </Button>
      </div>

      {roles.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 mb-4">Aucun rôle créé</p>
          <Button onClick={handleCreate} variant="primary">
            Créer votre premier rôle
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => (
            <div
              key={role.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    {role.name === 'Fondateur' && '👑 '}
                    {role.name}
                  </h4>
                  {role.isSystem && (
                    <Badge 
                      variant={role.name === 'Fondateur' ? 'warning' : 'info'} 
                      size="sm" 
                      className="mt-1"
                    >
                      {role.name === 'Fondateur' ? 'Fondateur' : 'Système'}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  {!role.isSystem && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(role)}
                      >
                        ✏️
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirm(role)}
                      >
                        🗑️
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {role.description && (
                <p className="text-sm text-gray-600 mb-4">{role.description}</p>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Permissions</span>
                  <span className="font-medium text-gray-900">
                    {role.permissions?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Utilisateurs</span>
                  <span className="font-medium text-gray-900">
                    {formatNumber(role._count?.userRoles || 0)}
                  </span>
                </div>
              </div>

              {role.permissions && role.permissions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.slice(0, 3).map((rp) => (
                      <Badge key={rp.id} variant="default" size="sm">
                        {rp.permission.name}
                      </Badge>
                    ))}
                    {role.permissions.length > 3 && (
                      <Badge variant="default" size="sm">
                        +{role.permissions.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isFormOpen && (
        <Modal
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false)
            setEditingRole(null)
          }}
          title={editingRole ? 'Modifier le rôle' : 'Créer un nouveau rôle'}
          size="lg"
        >
          <RoleForm
            role={editingRole}
            permissions={permissions}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setIsFormOpen(false)
              setEditingRole(null)
            }}
          />
        </Modal>
      )}

      {deleteConfirm && (
        <ConfirmDialog
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={handleDelete}
          title="Supprimer le rôle"
          message={`Êtes-vous sûr de vouloir supprimer le rôle "${deleteConfirm.name}" ? Cette action est irréversible.`}
          confirmText="Supprimer"
          cancelText="Annuler"
          variant="danger"
        />
      )}
    </div>
  )
}


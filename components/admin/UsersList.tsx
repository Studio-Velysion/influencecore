'use client'

import { useState, useEffect } from 'react'
import { AdminUser, Role } from '@/types/admin'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Modal from '@/components/common/Modal'
import UserRoleManager from './UserRoleManager'
import AddUserByEmail from './AddUserByEmail'
import Badge from '@/components/common/Badge'
import SearchInput from '@/components/common/SearchInput'
import { handleApiError } from '@/lib/api'
import { getRelativeTime } from '@/lib/validations'

interface UsersListProps {
  roles: Role[]
  onUpdate?: () => void
}

export default function UsersList({ roles, onUpdate }: UsersListProps) {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
        setFilteredUsers(data)
      }
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredUsers(users)
      return
    }

    const lowerQuery = query.toLowerCase()
    const filtered = users.filter(
      (user) =>
        user.email.toLowerCase().includes(lowerQuery) ||
        user.name?.toLowerCase().includes(lowerQuery) ||
        user.pseudo?.toLowerCase().includes(lowerQuery)
    )
    setFilteredUsers(filtered)
  }

  const handleUserUpdate = () => {
    fetchUsers()
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
        <h3 className="text-xl font-semibold text-gray-900">Utilisateurs</h3>
        <Button onClick={() => setIsAddUserOpen(true)} variant="primary">
          + Ajouter un utilisateur
        </Button>
      </div>

      <SearchInput
        placeholder="Rechercher un utilisateur..."
        onSearch={handleSearch}
      />

      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600">
            {users.length === 0
              ? 'Aucun utilisateur'
              : 'Aucun utilisateur trouvé'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inscription
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.name || user.pseudo || user.email}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      {user.isAdmin && (
                        <Badge variant="danger" size="sm" className="mt-1">
                          Admin
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {user.userRoles.length === 0 ? (
                        <span className="text-sm text-gray-400">Aucun rôle</span>
                      ) : (
                        user.userRoles.map((userRole) => (
                          <Badge key={userRole.id} variant="info" size="sm">
                            {userRole.role.name}
                          </Badge>
                        ))
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getRelativeTime(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedUser(user)}
                    >
                      Gérer les rôles
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedUser && (
        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title={`Gérer les rôles - ${selectedUser.email}`}
          size="md"
        >
          <UserRoleManager
            user={selectedUser}
            roles={roles}
            onUpdate={handleUserUpdate}
          />
        </Modal>
      )}

      {isAddUserOpen && (
        <Modal
          isOpen={isAddUserOpen}
          onClose={() => setIsAddUserOpen(false)}
          title="Ajouter un utilisateur par email"
          size="md"
        >
          <AddUserByEmail
            roles={roles}
            onSuccess={() => {
              setIsAddUserOpen(false)
              handleUserUpdate()
            }}
            onCancel={() => setIsAddUserOpen(false)}
          />
        </Modal>
      )}
    </div>
  )
}


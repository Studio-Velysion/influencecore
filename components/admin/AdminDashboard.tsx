'use client'

import { useState, useEffect } from 'react'
import RolesList from './RolesList'
import UsersList from './UsersList'
import QuickMakeFounder from './QuickMakeFounder'
import { Role } from '@/types/admin'
import Button from '@/components/common/Button'

type Tab = 'roles' | 'users'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('roles')
  const [roles, setRoles] = useState<Role[]>([])

  const handleRolesUpdate = async () => {
    try {
      const response = await fetch('/api/admin/roles')
      if (response.ok) {
        const data = await response.json()
        setRoles(data)
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  useEffect(() => {
    handleRolesUpdate()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Administration
        </h1>
        <p className="mt-2 text-gray-600">
          Gérez les rôles, permissions et utilisateurs
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('roles')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'roles'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Rôles & Permissions
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Utilisateurs
          </button>
        </nav>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'users' && (
          <QuickMakeFounder onSuccess={handleRolesUpdate} />
        )}
        {activeTab === 'roles' && (
          <RolesList onUpdate={handleRolesUpdate} />
        )}
        {activeTab === 'users' && (
          <UsersList roles={roles} onUpdate={handleRolesUpdate} />
        )}
      </div>
    </div>
  )
}


'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface User {
  id: string
  email: string
  name: string | null
  pseudo: string | null
  isAdmin: boolean
  createdAt: string
  userRoles: {
    id: string
    role: {
      id: string
      name: string
    }
  }[]
}

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [searchQuery])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const url = searchQuery
        ? `/api/admin/users?search=${encodeURIComponent(searchQuery)}`
        : '/api/admin/users'
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des utilisateurs')
      }
      const data = await response.json()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Utilisateurs</h3>
        <div className="card-tools">
          <div className="input-group input-group-sm" style={{ width: 250 }}>
            <input
              type="text"
              className="form-control"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="input-group-append">
              <button className="btn btn-default" type="button">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="card-body p-0">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nom / Pseudo</th>
              <th>Email</th>
              <th>Rôles</th>
              <th>Statut</th>
              <th>Inscription</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  {searchQuery ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur'}
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div>
                      <strong>{user.name || user.pseudo || 'Sans nom'}</strong>
                      {user.pseudo && user.name && (
                        <div className="text-muted small">@{user.pseudo}</div>
                      )}
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    {user.isAdmin ? (
                      <span className="badge bg-danger">Admin</span>
                    ) : user.userRoles.length > 0 ? (
                      user.userRoles.map((userRole) => (
                        <span key={userRole.id} className="badge bg-info me-1">
                          {userRole.role.name}
                        </span>
                      ))
                    ) : (
                      <span className="badge bg-secondary">Aucun rôle</span>
                    )}
                  </td>
                  <td>
                    {user.isAdmin ? (
                      <span className="badge bg-success">Actif</span>
                    ) : (
                      <span className="badge bg-primary">Utilisateur</span>
                    )}
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="btn btn-sm btn-primary"
                    >
                      <i className="bi bi-eye"></i>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}


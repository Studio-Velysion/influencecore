'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface User {
  id: string
  email: string
  name: string | null
  pseudo: string | null
  avatar: string | null
  isAdmin: boolean
  createdAt: string
  updatedAt: string
  // Ancien système d'abonnements supprimé
}

export default function UserDetail({ userId }: { userId: string }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('info')
  const [formData, setFormData] = useState({
    name: '',
    pseudo: '',
    email: '',
    isAdmin: false,
  })

  useEffect(() => {
    fetchUser()
  }, [userId])

  const fetchUser = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/users/${userId}`)
      if (!response.ok) {
        throw new Error('Erreur lors du chargement de l\'utilisateur')
      }
      const data = await response.json()
      setUser(data)
      setFormData({
        name: data.name || '',
        pseudo: data.pseudo || '',
        email: data.email || '',
        isAdmin: data.isAdmin || false,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour')
      }

      await fetchUser()
      setEditing(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde')
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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

  if (error || !user) {
    return (
      <div className="alert alert-danger" role="alert">
        {error || 'Utilisateur non trouvé'}
      </div>
    )
  }

  return (
    <div className="row">
      <div className="col-md-4">
        <div className="card card-primary card-outline">
          <div className="card-body box-profile">
            <div className="text-center">
              {user.avatar ? (
                <img
                  className="profile-user-img img-fluid img-circle"
                  src={user.avatar}
                  alt={user.name || user.pseudo || user.email}
                />
              ) : (
                <div className="profile-user-img img-fluid img-circle bg-primary d-flex align-items-center justify-content-center text-white" style={{ width: '100px', height: '100px', fontSize: '2rem' }}>
                  {(user.name || user.pseudo || user.email).charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <h3 className="profile-username text-center">
              {user.name || user.pseudo || 'Sans nom'}
            </h3>
            <p className="text-muted text-center">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="col-md-8">
        <div className="card">
          <div className="card-header p-2">
            <ul className="nav nav-pills">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'info' ? 'active' : ''}`}
                  onClick={() => setActiveTab('info')}
                  type="button"
                >
                  Informations
                </button>
              </li>
            </ul>
          </div>
          <div className="card-body">
            <div className="tab-content">
              {activeTab === 'info' && (
              <div className="tab-pane active" id="info">
                {editing ? (
                  <div className="form-group">
                    <label htmlFor="user-name">Nom</label>
                    <input
                      id="user-name"
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <label htmlFor="user-pseudo" className="mt-3">Pseudo</label>
                    <input
                      id="user-pseudo"
                      type="text"
                      className="form-control"
                      value={formData.pseudo}
                      onChange={(e) => setFormData({ ...formData, pseudo: e.target.value })}
                    />
                    <label htmlFor="user-email" className="mt-3">Email</label>
                    <input
                      id="user-email"
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <div className="form-check mt-3">
                      <input
                        id="user-is-admin"
                        type="checkbox"
                        className="form-check-input"
                        checked={formData.isAdmin}
                        onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
                      />
                      <label htmlFor="user-is-admin" className="form-check-label">Administrateur</label>
                    </div>
                    <div className="mt-3">
                      <button className="btn btn-primary" onClick={handleSave}>
                        Enregistrer
                      </button>
                      <button
                        className="btn btn-secondary ms-2"
                        onClick={() => {
                          setEditing(false)
                          fetchUser()
                        }}
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="row mb-3">
                      <div className="col-sm-3"><strong>Nom</strong></div>
                      <div className="col-sm-9">{user.name || '-'}</div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-sm-3"><strong>Pseudo</strong></div>
                      <div className="col-sm-9">{user.pseudo || '-'}</div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-sm-3"><strong>Email</strong></div>
                      <div className="col-sm-9">{user.email}</div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-sm-3"><strong>Statut</strong></div>
                      <div className="col-sm-9">
                        {user.isAdmin ? (
                          <span className="badge bg-danger">Administrateur</span>
                        ) : (
                          <span className="badge bg-primary">Utilisateur</span>
                        )}
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-sm-3"><strong>Inscription</strong></div>
                      <div className="col-sm-9">{formatDate(user.createdAt)}</div>
                    </div>
                    <button className="btn btn-primary" onClick={() => setEditing(true)}>
                      <i className="bi bi-pencil me-1"></i>
                      Modifier
                    </button>
                  </>
                )}
              </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


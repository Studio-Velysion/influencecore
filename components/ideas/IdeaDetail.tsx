'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { VideoIdea } from '@/types/ideas'
import Link from 'next/link'

interface IdeaDetailProps {
  ideaId: string
}

export default function IdeaDetail({ ideaId }: IdeaDetailProps) {
  const router = useRouter()
  const [idea, setIdea] = useState<VideoIdea | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    concept: '',
    platform: '',
    format: '',
    status: '',
    priority: '',
    targetDate: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  useEffect(() => {
    fetchIdea()
  }, [ideaId])

  const fetchIdea = async () => {
    try {
      const response = await fetch(`/api/ideas/${ideaId}`)
      if (response.ok) {
        const data = await response.json()
        setIdea(data)
        setFormData({
          title: data.title,
          concept: data.concept || '',
          platform: data.platform || '',
          format: data.format || '',
          status: data.status,
          priority: data.priority || '',
          targetDate: data.targetDate ? data.targetDate.split('T')[0] : '',
        })
      } else {
        setError('Idée non trouvée')
      }
    } catch (err) {
      setError('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')

    try {
      const response = await fetch(`/api/ideas/${ideaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          priority: formData.priority || null,
          targetDate: formData.targetDate || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Erreur lors de la sauvegarde')
        return
      }

      const updatedIdea = await response.json()
      setIdea(updatedIdea)
      setEditing(false)
    } catch (err) {
      setError('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/ideas/${ideaId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/ideas')
      } else {
        setError('Erreur lors de la suppression')
      }
    } catch (err) {
      setError('Erreur lors de la suppression')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Chargement...</div>
      </div>
    )
  }

  if (!idea) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Idée non trouvée</p>
        <Link
          href="/ideas"
          className="text-primary-600 hover:text-primary-700"
        >
          Retour aux idées
        </Link>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    'Idée': 'bg-gray-100 text-gray-800',
    'Écriture': 'bg-blue-100 text-blue-800',
    'Tournage': 'bg-yellow-100 text-yellow-800',
    'Montage': 'bg-purple-100 text-purple-800',
    'Programmée': 'bg-orange-100 text-orange-800',
    'Publiée': 'bg-green-100 text-green-800',
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <Link
            href="/ideas"
            className="text-primary-600 hover:text-primary-700 text-sm mb-2 inline-block"
          >
            ← Retour aux idées
          </Link>
          {editing ? (
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="text-3xl font-bold text-gray-900 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500"
            />
          ) : (
            <h1 className="text-3xl font-bold text-gray-900">{idea.title}</h1>
          )}
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {saving ? 'Sauvegarde...' : 'Enregistrer'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Modifier
              </button>
              {!deleteConfirm ? (
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                >
                  Supprimer
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Confirmer
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            {editing ? (
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="Idée">Idée</option>
                <option value="Écriture">Écriture</option>
                <option value="Tournage">Tournage</option>
                <option value="Montage">Montage</option>
                <option value="Programmée">Programmée</option>
                <option value="Publiée">Publiée</option>
              </select>
            ) : (
              <span className={`px-3 py-1 rounded text-sm font-medium ${statusColors[idea.status]}`}>
                {idea.status}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priorité
            </label>
            {editing ? (
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Aucune</option>
                <option value="Haute">Haute</option>
                <option value="Moyenne">Moyenne</option>
                <option value="Basse">Basse</option>
              </select>
            ) : (
              <span className="text-gray-900">
                {idea.priority || 'Aucune'}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plateforme
            </label>
            {editing ? (
              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Aucune</option>
                <option value="YouTube">YouTube</option>
                <option value="Twitch">Twitch</option>
                <option value="TikTok">TikTok</option>
                <option value="Instagram">Instagram</option>
                <option value="Autre">Autre</option>
              </select>
            ) : (
              <span className="text-gray-900">{idea.platform || 'Non spécifiée'}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Format
            </label>
            {editing ? (
              <select
                name="format"
                value={formData.format}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Aucun</option>
                <option value="Long">Long</option>
                <option value="Short">Short</option>
                <option value="Live">Live</option>
              </select>
            ) : (
              <span className="text-gray-900">{idea.format || 'Non spécifié'}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date cible
            </label>
            {editing ? (
              <input
                type="date"
                name="targetDate"
                value={formData.targetDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            ) : (
              <span className="text-gray-900">
                {idea.targetDate
                  ? new Date(idea.targetDate).toLocaleDateString('fr-FR')
                  : 'Non définie'}
              </span>
            )}
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Concept
          </label>
          {editing ? (
            <textarea
              name="concept"
              value={formData.concept}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Décrivez votre idée de vidéo..."
            />
          ) : (
            <p className="text-gray-900 whitespace-pre-wrap">
              {idea.concept || 'Aucun concept défini'}
            </p>
          )}
        </div>
      </div>

      {/* Section Scripts associés */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Scripts associés</h2>
          <Link
            href={`/scripts?ideaId=${ideaId}`}
            className="text-primary-600 hover:text-primary-700 text-sm"
          >
            + Créer un script
          </Link>
        </div>
        {idea.scripts && idea.scripts.length > 0 ? (
          <div className="space-y-2">
            {idea.scripts.map((script) => (
              <Link
                key={script.id}
                href={`/scripts/${script.id}`}
                className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <h3 className="font-medium text-gray-900">{script.title}</h3>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Aucun script associé</p>
        )}
      </div>
    </div>
  )
}


'use client'

import { useState } from 'react'

interface CreateIdeaModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function CreateIdeaModal({ onClose, onSuccess }: CreateIdeaModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    concept: '',
    platform: '',
    format: '',
    status: 'Idée',
    priority: '',
    targetDate: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          priority: formData.priority || null,
          targetDate: formData.targetDate || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Une erreur est survenue')
        return
      }

      onSuccess()
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card-velysion max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-purple-500/30">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-text-primary">Nouvelle idée vidéo</h2>
            <button
              onClick={onClose}
              className="text-text-tertiary hover:text-purple-400 transition-velysion"
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="bg-state-error/20 border border-state-error/30 text-state-error px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-2">
                Titre *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                required
                className="input-velysion w-full"
                placeholder="Ex: Mon premier vlog"
              />
            </div>

            <div>
              <label htmlFor="concept" className="block text-sm font-medium text-text-secondary mb-2">
                Concept
              </label>
              <textarea
                id="concept"
                name="concept"
                value={formData.concept}
                onChange={handleChange}
                rows={4}
                className="input-velysion w-full"
                placeholder="Décrivez votre idée de vidéo..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="platform" className="block text-sm font-medium text-text-secondary mb-2">
                  Plateforme
                </label>
                <select
                  id="platform"
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  className="input-velysion w-full"
                >
                  <option value="">Sélectionner...</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Twitch">Twitch</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div>
                <label htmlFor="format" className="block text-sm font-medium text-text-secondary mb-2">
                  Format
                </label>
                <select
                  id="format"
                  name="format"
                  value={formData.format}
                  onChange={handleChange}
                  className="input-velysion w-full"
                >
                  <option value="">Sélectionner...</option>
                  <option value="Long">Long</option>
                  <option value="Short">Short</option>
                  <option value="Live">Live</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-text-secondary mb-2">
                  Statut
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input-velysion w-full"
                >
                  <option value="Idée">Idée</option>
                  <option value="Écriture">Écriture</option>
                  <option value="Tournage">Tournage</option>
                  <option value="Montage">Montage</option>
                  <option value="Programmée">Programmée</option>
                  <option value="Publiée">Publiée</option>
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-text-secondary mb-2">
                  Priorité
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="input-velysion w-full"
                >
                  <option value="">Aucune</option>
                  <option value="Haute">Haute</option>
                  <option value="Moyenne">Moyenne</option>
                  <option value="Basse">Basse</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="targetDate" className="block text-sm font-medium text-text-secondary mb-2">
                Date cible
              </label>
              <input
                id="targetDate"
                name="targetDate"
                type="date"
                value={formData.targetDate}
                onChange={handleChange}
                className="input-velysion w-full"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-border-dark rounded-lg text-text-secondary hover:bg-bg-hover transition-velysion"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-velysion-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Création...' : 'Créer l\'idée'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}


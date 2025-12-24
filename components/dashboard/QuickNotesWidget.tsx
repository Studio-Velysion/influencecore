'use client'

import { useState } from 'react'

export default function QuickNotesWidget() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    setSuccess(false)

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
        }),
      })

      if (response.ok) {
        setContent('')
        setSuccess(true)
        setTimeout(() => setSuccess(false), 2000)
      }
    } catch (err) {
      console.error('Erreur:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card-velysion">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Notes instantanées
      </h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="input-velysion w-full"
          placeholder="Écrivez une note rapide..."
        />
        <div className="flex justify-between items-center mt-4">
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="btn-velysion-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          {success && (
            <span className="text-sm text-state-success flex items-center gap-2">
              <span>✓</span> Note enregistrée !
            </span>
          )}
        </div>
      </form>
    </div>
  )
}


'use client'

import { useState } from 'react'
import { QuickNote } from '@/types/notes'

interface NoteCardProps {
  note: QuickNote
  onUpdate: () => void
  onDelete: () => void
}

export default function NoteCard({ note, onUpdate, onDelete }: NoteCardProps) {
  const [editing, setEditing] = useState(false)
  const [content, setContent] = useState(note.content)
  const [tag, setTag] = useState(note.tag || '')
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          tag: tag || null,
        }),
      })

      if (response.ok) {
        setEditing(false)
        onUpdate()
      }
    } catch (err) {
      console.error('Erreur:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onDelete()
      }
    } catch (err) {
      console.error('Erreur:', err)
    }
  }

  return (
    <div className="card-velysion p-4">
      {editing ? (
        <div className="space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="input-velysion w-full"
            placeholder="Contenu de la note..."
          />
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Tag (optionnel)"
            className="input-velysion w-full"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 btn-velysion-primary text-sm disabled:opacity-50"
            >
              {saving ? 'Sauvegarde...' : 'Enregistrer'}
            </button>
            <button
              onClick={() => {
                setEditing(false)
                setContent(note.content)
                setTag(note.tag || '')
              }}
              className="px-3 py-1 border border-border-dark rounded-lg text-text-secondary hover:bg-bg-hover text-sm transition-velysion"
            >
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start mb-2">
            {note.tag && (
              <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded border border-purple-500/30">
                {note.tag}
              </span>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(true)}
                className="text-xs text-text-tertiary hover:text-purple-400 transition-velysion"
              >
                ✏️
              </button>
              {!deleteConfirm ? (
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="text-xs text-state-error hover:text-red-400 transition-velysion"
                >
                  🗑️
                </button>
              ) : (
                <div className="flex gap-1">
                  <button
                    onClick={handleDelete}
                    className="text-xs text-state-error hover:text-red-400 transition-velysion"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(false)}
                    className="text-xs text-text-tertiary hover:text-text-secondary transition-velysion"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>
          <p className="text-text-primary whitespace-pre-wrap mb-2">{note.content}</p>
          <div className="text-xs text-text-muted">
            {new Date(note.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </>
      )}
    </div>
  )
}


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
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      {editing ? (
        <div className="space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="Contenu de la note..."
          />
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Tag (optionnel)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-primary-600 text-white px-3 py-1 rounded-lg hover:bg-primary-700 disabled:opacity-50 text-sm"
            >
              {saving ? 'Sauvegarde...' : 'Enregistrer'}
            </button>
            <button
              onClick={() => {
                setEditing(false)
                setContent(note.content)
                setTag(note.tag || '')
              }}
              className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
            >
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start mb-2">
            {note.tag && (
              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                {note.tag}
              </span>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(true)}
                className="text-xs text-gray-600 hover:text-gray-900"
              >
                ✏️
              </button>
              {!deleteConfirm ? (
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  🗑️
                </button>
              ) : (
                <div className="flex gap-1">
                  <button
                    onClick={handleDelete}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(false)}
                    className="text-xs text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>
          <p className="text-gray-900 whitespace-pre-wrap mb-2">{note.content}</p>
          <div className="text-xs text-gray-400">
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


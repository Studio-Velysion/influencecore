'use client'

import { useState, useEffect } from 'react'
import NoteCard from './NoteCard'
import CreateNoteModal from './CreateNoteModal'
import { QuickNote } from '@/types/notes'

export default function NotesList() {
  const [notes, setNotes] = useState<QuickNote[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])

  const fetchNotes = async () => {
    try {
      const url = selectedTag ? `/api/notes?tag=${selectedTag}` : '/api/notes'
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setNotes(data)
        
        // Extraire les tags uniques
        const uniqueTags = Array.from(
          new Set(data.map((note: QuickNote) => note.tag).filter(Boolean))
        ) as string[]
        setTags(uniqueTags)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des notes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [selectedTag])

  const handleNoteCreated = () => {
    fetchNotes()
    setIsModalOpen(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-text-tertiary">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-text-primary">Notes rapides</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-velysion-primary"
        >
          + Nouvelle note
        </button>
      </div>

      {tags.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-velysion ${
              selectedTag === null
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'bg-bg-tertiary text-text-secondary hover:bg-bg-hover border border-border-dark'
            }`}
          >
            Toutes
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-velysion ${
                selectedTag === tag
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'bg-bg-tertiary text-text-secondary hover:bg-bg-hover border border-border-dark'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {notes.length === 0 ? (
        <div className="card-velysion p-12 text-center">
          <p className="text-text-tertiary mb-4">Aucune note pour le moment</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="link-velysion font-medium"
          >
            Créer votre première note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onUpdate={fetchNotes}
              onDelete={fetchNotes}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <CreateNoteModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleNoteCreated}
        />
      )}
    </div>
  )
}


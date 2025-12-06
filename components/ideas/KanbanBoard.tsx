'use client'

import { useState, useEffect } from 'react'
import IdeaCard from './IdeaCard'
import { VideoIdea } from '@/types/ideas'
import CreateIdeaModal from './CreateIdeaModal'

const statuses = ['Idée', 'Écriture', 'Tournage', 'Montage', 'Programmée', 'Publiée']

export default function KanbanBoard() {
  const [ideas, setIdeas] = useState<VideoIdea[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchIdeas = async () => {
    try {
      const response = await fetch('/api/ideas')
      if (response.ok) {
        const data = await response.json()
        setIdeas(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des idées:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIdeas()
  }, [])

  const getIdeasByStatus = (status: string) => {
    return ideas.filter((idea) => idea.status === status)
  }

  const handleIdeaCreated = () => {
    fetchIdeas()
    setIsModalOpen(false)
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
        <h2 className="text-2xl font-bold text-gray-900">Mes Idées Vidéos</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          + Nouvelle idée
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-4 min-w-max pb-4">
          {statuses.map((status) => {
            const statusIdeas = getIdeasByStatus(status)
            return (
              <div
                key={status}
                className="flex-shrink-0 w-80 bg-gray-50 rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">{status}</h3>
                  <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                    {statusIdeas.length}
                  </span>
                </div>
                <div className="space-y-3 min-h-[200px]">
                  {statusIdeas.length === 0 ? (
                    <div className="text-center text-gray-400 text-sm py-8">
                      Aucune idée
                    </div>
                  ) : (
                    statusIdeas.map((idea) => (
                      <IdeaCard key={idea.id} idea={idea} />
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {isModalOpen && (
        <CreateIdeaModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleIdeaCreated}
        />
      )}
    </div>
  )
}


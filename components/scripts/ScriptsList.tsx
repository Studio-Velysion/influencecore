'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ScriptCard from './ScriptCard'
import CreateScriptModal from './CreateScriptModal'
import { VideoScript } from '@/types/scripts'

export default function ScriptsList() {
  const searchParams = useSearchParams()
  const ideaId = searchParams?.get('ideaId')
  const [scripts, setScripts] = useState<VideoScript[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchScripts = async () => {
    try {
      const url = ideaId ? `/api/scripts?ideaId=${ideaId}` : '/api/scripts'
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setScripts(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des scripts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchScripts()
  }, [ideaId])

  const handleScriptCreated = () => {
    fetchScripts()
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
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mes Scripts</h2>
          {ideaId && (
            <p className="text-sm text-gray-600 mt-1">
              Scripts associés à cette idée
            </p>
          )}
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          + Nouveau script
        </button>
      </div>

      {scripts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 mb-4">Aucun script pour le moment</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Créer votre premier script
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scripts.map((script) => (
            <ScriptCard key={script.id} script={script} />
          ))}
        </div>
      )}

      {isModalOpen && (
        <CreateScriptModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleScriptCreated}
          ideaId={ideaId || undefined}
        />
      )}
    </div>
  )
}


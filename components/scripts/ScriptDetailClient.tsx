'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ScriptEditor from './ScriptEditor'
import { VideoScript } from '@/types/scripts'

export default function ScriptDetailClient({ scriptId }: { scriptId: string }) {
  const router = useRouter()
  const [script, setScript] = useState<VideoScript | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  useEffect(() => {
    fetchScript()
  }, [scriptId])

  const fetchScript = async () => {
    try {
      const response = await fetch(`/api/scripts/${scriptId}`)
      if (response.ok) {
        const data = await response.json()
        setScript(data)
      } else {
        router.push('/scripts')
      }
    } catch (err) {
      console.error('Erreur:', err)
      router.push('/scripts')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/scripts/${scriptId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/scripts')
      }
    } catch (err) {
      console.error('Erreur:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Chargement...</div>
      </div>
    )
  }

  if (!script) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Link
          href="/scripts"
          className="text-primary-600 hover:text-primary-700 text-sm"
        >
          ← Retour aux scripts
        </Link>
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
      </div>

      {script.videoIdea && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            📹 Associé à :{' '}
            <Link
              href={`/ideas/${script.videoIdea.id}`}
              className="font-medium hover:underline"
            >
              {script.videoIdea.title}
            </Link>
          </p>
        </div>
      )}

      <ScriptEditor scriptId={scriptId} initialScript={script} />
    </div>
  )
}


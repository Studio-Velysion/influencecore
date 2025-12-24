'use client'

import { useState, useEffect } from 'react'
import { VideoIdea } from '@/types/ideas'
import { VideoScript } from '@/types/scripts'
import { QuickNote } from '@/types/notes'
import { formatNumber } from '@/lib/utils'

interface Stats {
  totalIdeas: number
  ideasByStatus: Record<string, number>
  totalScripts: number
  totalNotes: number
  ideasWithTargetDate: number
}

export default function StatsWidget() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [ideasRes, scriptsRes, notesRes] = await Promise.all([
        fetch('/api/ideas'),
        fetch('/api/scripts'),
        fetch('/api/notes'),
      ])

      const ideas: VideoIdea[] = ideasRes.ok ? await ideasRes.json() : []
      const scripts: VideoScript[] = scriptsRes.ok ? await scriptsRes.json() : []
      const notes: QuickNote[] = notesRes.ok ? await notesRes.json() : []

      const ideasByStatus: Record<string, number> = {}
      ideas.forEach((idea) => {
        ideasByStatus[idea.status] = (ideasByStatus[idea.status] || 0) + 1
      })

      setStats({
        totalIdeas: ideas.length,
        ideasByStatus,
        totalScripts: scripts.length,
        totalNotes: notes.length,
        ideasWithTargetDate: ideas.filter((idea) => idea.targetDate).length,
      })
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="card-velysion">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-bg-tertiary rounded w-1/4"></div>
          <div className="h-8 bg-bg-tertiary rounded"></div>
        </div>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="card-velysion">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Statistiques
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 rounded-lg bg-bg-tertiary/50 border border-border-dark">
          <div className="text-2xl font-bold bg-gradient-purple-pink bg-clip-text text-transparent">
            {formatNumber(stats.totalIdeas)}
          </div>
          <div className="text-sm text-text-tertiary mt-1">Idées</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-bg-tertiary/50 border border-border-dark">
          <div className="text-2xl font-bold text-purple-400">
            {formatNumber(stats.totalScripts)}
          </div>
          <div className="text-sm text-text-tertiary mt-1">Scripts</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-bg-tertiary/50 border border-border-dark">
          <div className="text-2xl font-bold text-purple-300">
            {formatNumber(stats.totalNotes)}
          </div>
          <div className="text-sm text-text-tertiary mt-1">Notes</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-bg-tertiary/50 border border-border-dark">
          <div className="text-2xl font-bold text-gold-400">
            {formatNumber(stats.ideasWithTargetDate)}
          </div>
          <div className="text-sm text-text-tertiary mt-1">Programmées</div>
        </div>
      </div>

      {Object.keys(stats.ideasByStatus).length > 0 && (
        <div className="mt-6 pt-6 border-t border-border-dark">
          <h4 className="text-sm font-medium text-text-secondary mb-3">
            Répartition par statut
          </h4>
          <div className="space-y-2">
            {Object.entries(stats.ideasByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm text-text-tertiary">{status}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-bg-tertiary rounded-full h-2 border border-border-dark">
                    <div
                      className="bg-gradient-purple-pink h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${(count / stats.totalIdeas) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-text-primary w-8 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


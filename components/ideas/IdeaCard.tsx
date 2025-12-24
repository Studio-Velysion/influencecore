'use client'

import Link from 'next/link'
import { VideoIdea } from '@/types/ideas'
import { getRelativeTime } from '@/lib/validations'
import { cn } from '@/lib/utils'

interface IdeaCardProps {
  idea: VideoIdea
}

const statusColors: Record<string, string> = {
  'Idée': 'bg-bg-tertiary text-text-secondary border border-border-dark',
  'Écriture': 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  'Tournage': 'bg-gold-500/20 text-gold-400 border border-gold-500/30',
  'Montage': 'bg-purple-600/20 text-purple-300 border border-purple-600/30',
  'Programmée': 'bg-purple-400/20 text-purple-300 border border-purple-400/30',
  'Publiée': 'bg-state-success/20 text-state-success border border-state-success/30',
}

const priorityColors: Record<string, string> = {
  'Haute': 'text-state-error font-semibold',
  'Moyenne': 'text-gold-400',
  'Basse': 'text-text-tertiary',
}

export default function IdeaCard({ idea }: IdeaCardProps) {
  const statusColor = statusColors[idea.status] || statusColors['Idée']
  const priorityColor = priorityColors[idea.priority || ''] || ''

  return (
    <Link href={`/ideas/${idea.id}`}>
      <div className="card-velysion p-4 hover:glow-purple transition-all cursor-pointer group">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-text-primary line-clamp-2 flex-1 group-hover:text-purple-400 transition-velysion">
            {idea.title}
          </h3>
          <span className={cn('ml-2 px-2 py-1 rounded text-xs font-medium whitespace-nowrap', statusColor)}>
            {idea.status}
          </span>
        </div>

        {idea.concept && (
          <p className="text-sm text-text-tertiary mb-3 line-clamp-2">
            {idea.concept}
          </p>
        )}

        <div className="flex flex-wrap gap-2 text-xs text-text-muted mb-2">
          {idea.platform && (
            <span className="bg-bg-tertiary px-2 py-1 rounded border border-border-dark">
              {idea.platform}
            </span>
          )}
          {idea.format && (
            <span className="bg-bg-tertiary px-2 py-1 rounded border border-border-dark">
              {idea.format}
            </span>
          )}
          {idea.priority && (
            <span className={cn('px-2 py-1', priorityColor)}>
              ⚡ {idea.priority}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-text-muted mt-3 pt-3 border-t border-border-dark">
          {idea.targetDate && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(idea.targetDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
            </div>
          )}
          {idea.scripts && idea.scripts.length > 0 && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {idea.scripts.length} script{idea.scripts.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

'use client'

import Link from 'next/link'
import { VideoIdea } from '@/types/ideas'
import { getRelativeTime } from '@/lib/validations'
import { cn } from '@/lib/utils'

interface IdeaCardProps {
  idea: VideoIdea
}

const statusColors: Record<string, string> = {
  'Idée': 'bg-gray-100 text-gray-800',
  'Écriture': 'bg-blue-100 text-blue-800',
  'Tournage': 'bg-yellow-100 text-yellow-800',
  'Montage': 'bg-purple-100 text-purple-800',
  'Programmée': 'bg-orange-100 text-orange-800',
  'Publiée': 'bg-green-100 text-green-800',
}

const priorityColors: Record<string, string> = {
  'Haute': 'text-red-600 font-semibold',
  'Moyenne': 'text-yellow-600',
  'Basse': 'text-gray-600',
}

export default function IdeaCard({ idea }: IdeaCardProps) {
  const statusColor = statusColors[idea.status] || statusColors['Idée']
  const priorityColor = priorityColors[idea.priority || ''] || ''

  return (
    <Link href={`/ideas/${idea.id}`}>
      <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-all cursor-pointer group">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1 group-hover:text-primary-600 transition-colors">
            {idea.title}
          </h3>
          <span className={cn('ml-2 px-2 py-1 rounded text-xs font-medium whitespace-nowrap', statusColor)}>
            {idea.status}
          </span>
        </div>

        {idea.concept && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {idea.concept}
          </p>
        )}

        <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
          {idea.platform && (
            <span className="bg-gray-50 px-2 py-1 rounded border border-gray-200">
              {idea.platform}
            </span>
          )}
          {idea.format && (
            <span className="bg-gray-50 px-2 py-1 rounded border border-gray-200">
              {idea.format}
            </span>
          )}
          {idea.priority && (
            <span className={cn('px-2 py-1', priorityColor)}>
              ⚡ {idea.priority}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
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

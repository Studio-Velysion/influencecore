'use client'

import Link from 'next/link'
import { VideoScript } from '@/types/scripts'

interface ScriptCardProps {
  script: VideoScript
}

export default function ScriptCard({ script }: ScriptCardProps) {
  const partsCount = script.content?.parts?.length || 0

  return (
    <Link href={`/scripts/${script.id}`}>
      <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {script.title}
        </h3>

        {script.videoIdea && (
          <div className="text-sm text-gray-600 mb-2">
            📹 {script.videoIdea.title}
          </div>
        )}

        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
          {partsCount > 0 && (
            <span className="bg-gray-50 px-2 py-1 rounded">
              {partsCount} partie{partsCount > 1 ? 's' : ''}
            </span>
          )}
          {script.checklist?.tournage?.length > 0 && (
            <span className="bg-blue-50 px-2 py-1 rounded text-blue-700">
              {script.checklist.tournage.filter((item: any) => item.checked).length}/{script.checklist.tournage.length} tournage
            </span>
          )}
          {script.checklist?.montage?.length > 0 && (
            <span className="bg-purple-50 px-2 py-1 rounded text-purple-700">
              {script.checklist.montage.filter((item: any) => item.checked).length}/{script.checklist.montage.length} montage
            </span>
          )}
        </div>

        <div className="text-xs text-gray-400 mt-2">
          {new Date(script.updatedAt).toLocaleDateString('fr-FR')}
        </div>
      </div>
    </Link>
  )
}


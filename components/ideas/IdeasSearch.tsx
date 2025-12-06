'use client'

import { useState } from 'react'
import SearchInput from '@/components/common/SearchInput'
import Select from '@/components/common/Select'
import { VideoIdea } from '@/types/ideas'

interface IdeasSearchProps {
  ideas: VideoIdea[]
  onFiltered: (filtered: VideoIdea[]) => void
}

export default function IdeasSearch({ ideas, onFiltered }: IdeasSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [platformFilter, setPlatformFilter] = useState('')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    applyFilters(query, statusFilter, platformFilter)
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value
    setStatusFilter(status)
    applyFilters(searchQuery, status, platformFilter)
  }

  const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const platform = e.target.value
    setPlatformFilter(platform)
    applyFilters(searchQuery, statusFilter, platform)
  }

  const applyFilters = (
    query: string,
    status: string,
    platform: string
  ) => {
    let filtered = [...ideas]

    // Recherche textuelle
    if (query.trim()) {
      const lowerQuery = query.toLowerCase()
      filtered = filtered.filter(
        (idea) =>
          idea.title.toLowerCase().includes(lowerQuery) ||
          idea.concept?.toLowerCase().includes(lowerQuery)
      )
    }

    // Filtre par statut
    if (status) {
      filtered = filtered.filter((idea) => idea.status === status)
    }

    // Filtre par plateforme
    if (platform) {
      filtered = filtered.filter((idea) => idea.platform === platform)
    }

    onFiltered(filtered)
  }

  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'Idée', label: 'Idée' },
    { value: 'Écriture', label: 'Écriture' },
    { value: 'Tournage', label: 'Tournage' },
    { value: 'Montage', label: 'Montage' },
    { value: 'Programmée', label: 'Programmée' },
    { value: 'Publiée', label: 'Publiée' },
  ]

  const platformOptions = [
    { value: '', label: 'Toutes les plateformes' },
    { value: 'YouTube', label: 'YouTube' },
    { value: 'Twitch', label: 'Twitch' },
    { value: 'TikTok', label: 'TikTok' },
    { value: 'Instagram', label: 'Instagram' },
  ]

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <SearchInput
            placeholder="Rechercher une idée..."
            onSearch={handleSearch}
          />
        </div>
        <div>
          <Select
            label=""
            options={statusOptions}
            value={statusFilter}
            onChange={handleStatusChange}
          />
        </div>
        <div>
          <Select
            label=""
            options={platformOptions}
            value={platformFilter}
            onChange={handlePlatformChange}
          />
        </div>
      </div>
    </div>
  )
}


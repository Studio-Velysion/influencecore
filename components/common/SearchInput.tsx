'use client'

import { useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import Input from './Input'

interface SearchInputProps {
  placeholder?: string
  onSearch: (query: string) => void
  debounceMs?: number
}

export default function SearchInput({
  placeholder = 'Rechercher...',
  onSearch,
  debounceMs = 300,
}: SearchInputProps) {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, debounceMs)

  // Appeler onSearch quand la recherche est debounced
  useEffect(() => {
    onSearch(debouncedQuery)
  }, [debouncedQuery, onSearch])

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10"
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  )
}


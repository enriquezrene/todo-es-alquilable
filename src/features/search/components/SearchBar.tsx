'use client'

import { useState, useEffect, useRef } from 'react'

type SearchBarProps = {
  initialValue?: string
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
}

export default function SearchBar({
  initialValue = '',
  onSearch,
  placeholder = 'Buscar artículos para alquilar...',
  className = '',
}: SearchBarProps) {
  const [value, setValue] = useState(initialValue)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  // Cleanup debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(value)
  }

  const handleIconClick = () => {
    onSearch(value)
  }

  // Debounced search that triggers 2 seconds after user stops typing
  const debouncedSearch = (searchValue: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    
    debounceRef.current = setTimeout(() => {
      onSearch(searchValue)
    }, 2000) // 2 seconds
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          const newValue = e.target.value
          setValue(newValue)
          debouncedSearch(newValue)
        }}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{ fontSize: '16px' }}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />
      <button
        type="button"
        onClick={handleIconClick}
        className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Buscar"
      >
        <svg
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </form>
  )
}

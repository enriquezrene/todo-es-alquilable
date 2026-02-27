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
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)

    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      onSearch(newValue)
    }, 300)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    clearTimeout(timerRef.current)
    onSearch(value)
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <svg
        className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
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
    </form>
  )
}

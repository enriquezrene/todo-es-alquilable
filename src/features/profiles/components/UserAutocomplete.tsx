'use client'

import { useState, useEffect, useRef } from 'react'
import type { UserProfile } from '@/shared/types/user-profile'
import { buscarUsuarios } from '@/features/profiles/services/user-search-service'
import { registrarError } from '@/lib/registrar-error'

type UserAutocompleteProps = {
  onUserSelect: (user: UserProfile) => void
  placeholder?: string
  className?: string
}

export default function UserAutocomplete({ onUserSelect, placeholder = "Buscar por nombre, apellido o email", className = "" }: UserAutocompleteProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const searchUsers = async () => {
      if (searchTerm.trim().length < 2) {
        setResults([])
        setShowResults(false)
        return
      }

      setLoading(true)
      try {
        const users = await buscarUsuarios(searchTerm)
        setResults(users)
        setShowResults(true)
      } catch (error) {
        registrarError(error, 'UserAutocomplete:searchUsers')
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(searchUsers, 300)
    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && !inputRef.current.contains(event.target as Node) &&
        resultsRef.current && !resultsRef.current.contains(event.target as Node)
      ) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleUserSelect = (user: UserProfile) => {
    setSelectedUser(user)
    setSearchTerm(`${user.firstName} ${user.lastName} (${user.email})`)
    setShowResults(false)
    onUserSelect(user)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    
    // Clear selection if user is typing
    if (selectedUser && !value.includes(`${selectedUser.firstName} ${selectedUser.lastName}`)) {
      setSelectedUser(null)
    }
  }

  const handleClear = () => {
    setSearchTerm('')
    setSelectedUser(null)
    setResults([])
    setShowResults(false)
    inputRef.current?.focus()
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        {loading && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <svg className="h-4 w-4 animate-spin text-gray-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2v4m0 12v4M8.5 8.5l3 3-3 3M15.5 15.5l-3-3 3-3" />
            </svg>
          </div>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div
          ref={resultsRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {results.map((user) => (
            <div
              key={user.id}
              onClick={() => handleUserSelect(user)}
              className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                  <div className="text-xs text-gray-400">{user.phone}</div>
                </div>
                <div className="text-xs text-green-600 font-medium">
                  ✓ Verificado
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showResults && results.length === 0 && searchTerm.trim().length >= 2 && (
        <div
          ref={resultsRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg"
        >
          <div className="px-3 py-4 text-center text-gray-500">
            <svg className="h-8 w-8 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-sm">No se encontraron usuarios</p>
            <p className="text-xs text-gray-400 mt-1">Intenta con otro nombre, apellido o email</p>
          </div>
        </div>
      )}

      {selectedUser && (
        <input type="hidden" name="selectedUserId" value={selectedUser.id} />
      )}
    </div>
  )
}

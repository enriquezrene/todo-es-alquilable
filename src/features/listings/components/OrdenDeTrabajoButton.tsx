'use client'

import { useState } from 'react'
import { descargarOrdenDeTrabajo } from '../services/orden-de-trabajo-service'
import { registrarError } from '@/lib/registrar-error'

type Props = {
  className?: string
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

export default function OrdenDeTrabajoButton({ 
  className = '', 
  variant = 'primary',
  size = 'md'
}: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await descargarOrdenDeTrabajo()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      registrarError(err as Error, 'OrdenDeTrabajoButton:handleDownload')
    } finally {
      setIsLoading(false)
    }
  }

  const getButtonClasses = () => {
    const baseClasses = 'flex items-center gap-2 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2'
    
    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500'
    }
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    }
    
    return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`
  }

  return (
    <div className={className}>
      <button
        onClick={handleDownload}
        disabled={isLoading}
        className={getButtonClasses()}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Descargando...
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Descargar Orden de Trabajo
          </>
        )}
      </button>
      
      {error && (
        <p className="text-red-600 text-sm mt-2" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

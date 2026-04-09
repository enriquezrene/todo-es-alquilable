'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import LocationPicker, { LocationData } from '@/shared/components/maps/LocationPicker'
import type { Ubicacion } from '@/shared/types/location'
import { registrarError } from '@/lib/registrar-error'

type Props = {
  onLocationChange: (ubicacion: Ubicacion | null) => void
  initialLocation?: Ubicacion | null
  className?: string
  disabled?: boolean
  required?: boolean
  error?: string | null
}

export default function LocationSelector({ 
  onLocationChange,
  initialLocation = null,
  className = '',
  disabled = false,
  required = false,
  error: externalError = null
}: Props) {
  const [ubicacion, setUbicacion] = useState<Ubicacion | null>(initialLocation)
  const [error, setError] = useState<string | null>(externalError)

  useEffect(() => {
    if (externalError !== error) {
      setError(externalError)
    }
  }, [externalError, error])

  const handleLocationSelect = useCallback((locationData: LocationData) => {
    try {
      const nuevaUbicacion: Ubicacion = {
        coordenadas: {
          lat: locationData.lat,
          lng: locationData.lng,
        },
        direccion: {
          direccionCompleta: locationData.address,
          calle: locationData.address,
          ciudad: locationData.city || '',
          provincia: locationData.province || '',
          pais: locationData.country || 'Ecuador',
        },
        timestamp: new Date(),
      }
      
      setUbicacion(nuevaUbicacion)
      setError(null)
      onLocationChange(nuevaUbicacion)
    } catch (err) {
      registrarError(err as Error, 'LocationSelector:handleLocationSelect')
      setError('Error al seleccionar la ubicación')
    }
  }, [onLocationChange])

  const handleRemoveLocation = useCallback(() => {
    setUbicacion(null)
    setError(null)
    onLocationChange(null)
  }, [onLocationChange])

  const isValidLocation = (loc: Ubicacion | null): boolean => {
    if (!loc) return !required
    return (
      loc.coordenadas.lat >= -5 && loc.coordenadas.lat <= 2 &&
      loc.coordenadas.lng >= -81 && loc.coordenadas.lng <= -75 &&
      loc.direccion.ciudad.trim().length > 0 &&
      loc.direccion.provincia.trim().length > 0
    )
  }

  const locationError = error || (required && !isValidLocation(ubicacion) ? 'La ubicación es requerida' : null)

  const initialLocationData = useMemo(
    () =>
      ubicacion
        ? {
            lat: ubicacion.coordenadas.lat,
            lng: ubicacion.coordenadas.lng,
            address: ubicacion.direccion.direccionCompleta,
            city: ubicacion.direccion.ciudad,
            province: ubicacion.direccion.provincia,
            country: ubicacion.direccion.pais,
          }
        : undefined,
    [ubicacion],
  )

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ubicación {required && <span className="text-red-500">*</span>}
        </label>

        <LocationPicker
          onLocationSelect={handleLocationSelect}
          initialLocation={initialLocationData}
          height="300px"
        />

        {ubicacion && (
          <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <h4 className="font-medium text-green-900">Ubicación seleccionada</h4>
                  <p className="text-sm text-green-700 mt-1">
                    {ubicacion.direccion.direccionCompleta}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {ubicacion.direccion.ciudad}, {ubicacion.direccion.provincia}, {ubicacion.direccion.pais}
                  </p>
                </div>
              </div>
              {!disabled && (
                <button
                  type="button"
                  onClick={handleRemoveLocation}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Eliminar ubicación"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {locationError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{locationError}</p>
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• La ubicación ayuda a los rentantes a saber dónde se encuentra tu artículo</p>
        <p>• Solo se mostrará la ciudad y provincia, no tu dirección exacta</p>
        <p>• Puedes actualizar tu ubicación en cualquier momento</p>
      </div>
    </div>
  )
}

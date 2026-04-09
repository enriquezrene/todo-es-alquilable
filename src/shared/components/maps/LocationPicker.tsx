import { useState, useEffect, useCallback, useMemo } from 'react'
import GoogleMap, { MapMarker } from './GoogleMap'
import { GOOGLE_MAPS_CONFIG } from '@/lib/maps/google-maps-config'
import { registrarError } from '@/lib/registrar-error'

export interface LocationData {
  lat: number
  lng: number
  address: string
  city?: string
  province?: string
  country?: string
}

interface LocationPickerProps {
  onLocationSelect: (location: LocationData) => void
  initialLocation?: LocationData
  height?: string
  className?: string
}

export default function LocationPicker({
  onLocationSelect,
  initialLocation,
  height = '400px',
  className = ''
}: LocationPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(initialLocation || null)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setSelectedLocation(initialLocation || null)
    setSearchQuery(initialLocation?.address || '')
  }, [initialLocation])

  const reverseGeocode = useCallback(async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `/api/maps/proxy?endpoint=geocode/json&latlng=${lat},${lng}`
      )
      
      if (!response.ok) {
        throw new Error('Geocoding request failed')
      }

      const data = await response.json()
      
      if (data.status === 'OK' && data.results.length > 0) {
        return data.results[0].formatted_address
      }
      
      // Return coordinates as fallback if no address found
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    } catch {
      // Return coordinates as fallback on error
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    }
  }, [])

  const extractCity = useCallback((address: string): string | undefined => {
    // Simple city extraction - can be improved with more sophisticated parsing
    const ecuadorianCities = ['Quito', 'Guayaquil', 'Cuenca', 'Santo Domingo', 'Ambato', 'Manta', 'Portoviejo', 'Loja', 'Ibarra', 'Riobamba']
    
    for (const city of ecuadorianCities) {
      if (address.includes(city)) {
        return city
      }
    }
    
    return undefined
  }, [])

  const extractProvince = useCallback((address: string): string | undefined => {
    // Simple province extraction - can be improved with more sophisticated parsing
    const ecuadorianProvinces = [
      'Pichincha', 'Guayas', 'Azuay', 'Manabí', 'Santo Domingo de los Tsáchilas',
      'Tungurahua', 'El Oro', 'Loja', 'Imbabura', 'Chimborazo', 'Cotopaxi',
      'Napo', 'Pastaza', 'Zamora Chinchipe', 'Morona Santiago', 'Galápagos',
      'Esmeraldas', 'Cañar', 'Santa Elena', 'Bolívar', 'Los Ríos', 'Sucumbíos',
      'Orellana', 'Dominican Republic'
    ]
    
    for (const province of ecuadorianProvinces) {
      if (address.includes(province)) {
        return province
      }
    }
    
    return undefined
  }, [])

  const handleMapClick = useCallback(async (event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return

    const lat = event.latLng.lat()
    const lng = event.latLng.lng()

    try {
      // Reverse geocoding to get address
      const address = await reverseGeocode(lat, lng)
      const location: LocationData = {
        lat,
        lng,
        address,
        city: extractCity(address),
        province: extractProvince(address),
        country: 'Ecuador'
      }

      setSelectedLocation(location)
      onLocationSelect(location)
    } catch (error) {
      registrarError(error as Error, 'LocationPicker:handleMapClick')
      console.error('Error getting address from coordinates:', error)
      
      // Still allow location selection even if geocoding fails
      const fallbackLocation: LocationData = {
        lat,
        lng,
        address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        country: 'Ecuador'
      }
      
      setSelectedLocation(fallbackLocation)
      onLocationSelect(fallbackLocation)
    }
  }, [extractCity, extractProvince, onLocationSelect, reverseGeocode])

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    
    if (query.length < 3) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    try {
      const results = await searchPlaces(query)
      setSuggestions(results)
    } catch (error) {
      registrarError(error as Error, 'LocationPicker:handleSearch')
      console.error('Error searching places:', error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionSelect = async (suggestion: string) => {
    setSuggestions([])

    try {
      const location = await geocodeAddress(suggestion)
      setSearchQuery(location.address)
      setSelectedLocation(location)
      onLocationSelect(location)
    } catch (error) {
      registrarError(error as Error, 'LocationPicker:handleSuggestionSelect')
      console.error('Error geocoding address:', error)
    }
  }

  const geocodeAddress = async (address: string): Promise<LocationData> => {
    try {
      const response = await fetch(
        `/api/maps/proxy?endpoint=geocode/json&address=${encodeURIComponent(address)}`
      )
      
      if (!response.ok) {
        throw new Error('Geocoding request failed')
      }

      const data = await response.json()
      
      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0]
        const location = result.geometry.location
        
        return {
          lat: location.lat,
          lng: location.lng,
          address: result.formatted_address,
          city: extractCity(result.formatted_address),
          province: extractProvince(result.formatted_address),
          country: 'Ecuador'
        }
      }
      
      throw new Error('No results found')
    } catch (error) {
      throw new Error(`Geocoding failed: ${error}`)
    }
  }

  const searchPlaces = async (query: string): Promise<string[]> => {
    try {
      const response = await fetch(
        `/api/maps/proxy?endpoint=place/autocomplete/json&query=${encodeURIComponent(query)}`
      )
      
      if (!response.ok) {
        throw new Error('Place search request failed')
      }

      const data = await response.json()
      
      if (data.status === 'OK' && data.predictions) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return data.predictions.map((prediction: any) => prediction.description)
      }
      
      return []
    } catch (error) {
      // Return empty array on error instead of throwing
      console.error('Place search error:', error)
      return []
    }
  }

  const handleMarkerDrag = useCallback(async ({ lat, lng }: { lat: number; lng: number }) => {
    try {
      const address = await reverseGeocode(lat, lng)
      const updatedLocation: LocationData = {
        lat,
        lng,
        address,
        city: extractCity(address),
        province: extractProvince(address),
        country: 'Ecuador'
      }

      setSearchQuery(updatedLocation.address)
      setSelectedLocation(updatedLocation)
      onLocationSelect(updatedLocation)
    } catch (error) {
      registrarError(error as Error, 'LocationPicker:handleMarkerDrag')

      const fallbackLocation: LocationData = {
        lat,
        lng,
        address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        country: 'Ecuador'
      }

      setSearchQuery(fallbackLocation.address)
      setSelectedLocation(fallbackLocation)
      onLocationSelect(fallbackLocation)
    }
  }, [extractCity, extractProvince, onLocationSelect, reverseGeocode])

  const markers: MapMarker[] = useMemo(
    () =>
      selectedLocation
        ? [
            {
              id: 'selected',
              position: { lat: selectedLocation.lat, lng: selectedLocation.lng },
              title: selectedLocation.address,
              description: selectedLocation.address,
              type: 'selected',
              draggable: true,
              onDragEnd: handleMarkerDrag
            }
          ]
        : [],
    [handleMarkerDrag, selectedLocation],
  )

  const center = useMemo(
    () =>
      selectedLocation
        ? { lat: selectedLocation.lat, lng: selectedLocation.lng }
        : GOOGLE_MAPS_CONFIG.defaultCenter,
    [selectedLocation],
  )

  const handleMapReady = useCallback((map: google.maps.Map) => {
    map.addListener('click', handleMapClick)
  }, [handleMapClick])

  return (
    <div className={className}>
      {/* Search Input */}
      <div className="relative mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Buscar dirección o lugar..."
          autoComplete="off"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        
        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionSelect(suggestion)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute right-2 top-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {/* Map */}
      <GoogleMap
        center={center}
        zoom={selectedLocation ? 16 : GOOGLE_MAPS_CONFIG.defaultZoom}
        markers={markers}
        height={height}
        onMapReady={handleMapReady}
      />

      {/* Selected Location Info */}
      {selectedLocation && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Ubicación seleccionada:</h3>
          <p className="text-sm text-gray-600">{selectedLocation.address}</p>
          {selectedLocation.city && (
            <p className="text-sm text-gray-500">
              {selectedLocation.city}, {selectedLocation.province || 'Ecuador'}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

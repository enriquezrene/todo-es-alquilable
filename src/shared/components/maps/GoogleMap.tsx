import { useEffect, useRef, useState, useCallback } from 'react'
import { GOOGLE_MAPS_CONFIG, loadGoogleMapsLibrary, isGoogleMapsConfigured } from '@/lib/maps/google-maps-config'
import { registrarError } from '@/lib/registrar-error'

// Type definitions for Google Maps components
export interface MapMarker {
  id: string
  position: { lat: number; lng: number }
  title?: string
  description?: string
  type?: 'user' | 'listing' | 'selected'
  draggable?: boolean
  onDragEnd?: (position: { lat: number; lng: number }) => void
}

export interface MapCircle {
  id: string
  center: { lat: number; lng: number }
  radius: number
  fillColor?: string
  fillOpacity?: number
  strokeColor?: string
  strokeOpacity?: number
  strokeWeight?: number
}

export interface MapConfig {
  center?: { lat: number; lng: number }
  zoom?: number
  markers?: MapMarker[]
  circles?: MapCircle[]
  controls?: {
    zoom?: boolean
    streetView?: boolean
    mapTypeControl?: boolean
  }
  height?: string
  className?: string
  onMapReady?: (map: google.maps.Map) => void
  onMarkerClick?: (marker: MapMarker) => void
}

export default function GoogleMap({
  center = GOOGLE_MAPS_CONFIG.defaultCenter,
  zoom = GOOGLE_MAPS_CONFIG.defaultZoom,
  markers = [],
  circles = [],
  controls = {
    zoom: true,
    streetView: false,
    mapTypeControl: false
  },
  height = '400px',
  className = '',
  onMapReady,
  onMarkerClick
}: MapConfig) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const initialCenterRef = useRef(center)
  const initialZoomRef = useRef(zoom)
  const initialMarkersRef = useRef(markers)
  const initialCirclesRef = useRef(circles)
  const marcadoresRef = useRef<Map<string, google.maps.Marker>>(new Map())
  const circulosRef = useRef<Map<string, google.maps.Circle>>(new Map())

  const updateMarkers = useCallback(async (map: google.maps.Map, markerList: MapMarker[]) => {
    try {
      // Load Marker library if needed
      await loadGoogleMapsLibrary('marker')

      // Clear existing markers
      marcadoresRef.current.forEach(marker => marker.setMap(null))
      marcadoresRef.current.clear()

      // Add new markers
      markerList.forEach(markerData => {
        const marker = new google.maps.Marker({
          position: markerData.position,
          map,
          title: markerData.title,
          animation: google.maps.Animation.DROP,
          icon: createMarkerIcon(markerData.type || 'user'),
          draggable: markerData.draggable ?? false
        })

        // Add info window if description exists
        if (markerData.description || onMarkerClick) {
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 8px; max-width: 200px;">
                ${markerData.title ? `<h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${markerData.title}</h3>` : ''}
                ${markerData.description ? `<p style="margin: 0; font-size: 12px; color: #666;">${markerData.description}</p>` : ''}
              </div>
            `
          })

          marker.addListener('click', () => {
            infoWindow.open(map, marker)
            onMarkerClick?.(markerData)
          })
        }

        if (markerData.draggable && markerData.onDragEnd) {
          marker.addListener('dragend', () => {
            const position = marker.getPosition()
            if (!position) return

            markerData.onDragEnd?.({
              lat: position.lat(),
              lng: position.lng()
            })
          })
        }

        marcadoresRef.current.set(markerData.id, marker)
      })
    } catch (err) {
      registrarError(err as Error, 'GoogleMap:updateMarkers')
      console.error('Error updating markers:', err)
    }
  }, [onMarkerClick])

  const updateCircles = useCallback((map: google.maps.Map, circleList: MapCircle[]) => {
    circulosRef.current.forEach((circle) => circle.setMap(null))
    circulosRef.current.clear()

    circleList.forEach((circleData) => {
      const circle = new google.maps.Circle({
        map,
        center: circleData.center,
        radius: circleData.radius,
        fillColor: circleData.fillColor || '#2563EB',
        fillOpacity: circleData.fillOpacity ?? 0.18,
        strokeColor: circleData.strokeColor || '#2563EB',
        strokeOpacity: circleData.strokeOpacity ?? 0.45,
        strokeWeight: circleData.strokeWeight ?? 2,
      })

      circulosRef.current.set(circleData.id, circle)
    })
  }, [])

  const createMarkerIcon = (type: MapMarker['type']) => {
    const icons: Record<NonNullable<MapMarker['type']>, google.maps.Icon> = {
      user: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="12" fill="#3B82F6" stroke="white" stroke-width="3"/>
            <circle cx="16" cy="12" r="4" fill="white"/>
            <path d="M8 20 Q16 28 24 20" stroke="white" stroke-width="2" fill="none"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(32, 32),
        anchor: new google.maps.Point(16, 32)
      },
      listing: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="24" height="24" rx="4" fill="#10B981" stroke="white" stroke-width="3"/>
            <rect x="8" y="12" width="16" height="2" fill="white"/>
            <rect x="8" y="16" width="14" height="2" fill="white"/>
            <rect x="8" y="20" width="16" height="2" fill="white"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(32, 32),
        anchor: new google.maps.Point(16, 32)
      },
      selected: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="#EF4444" stroke="white" stroke-width="4"/>
            <circle cx="20" cy="16" r="5" fill="white"/>
            <path d="M10 24 Q20 34 30 24" stroke="white" stroke-width="3" fill="none"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 40)
      }
    }

    if (!type) {
      return icons.user
    }

    return icons[type]
  }

  useEffect(() => {
    if (!isGoogleMapsConfigured()) {
      setError('Google Maps no está configurado. Contacta al administrador.')
      return
    }

    const initializeMap = async () => {
      if (!mapRef.current) return

      try {
        // Load the Maps library
        const { Map } = await loadGoogleMapsLibrary('maps')
        
        // Create map instance
        const map = new Map(mapRef.current, {
          center: initialCenterRef.current,
          zoom: initialZoomRef.current,
          mapTypeControl: controls.mapTypeControl,
          streetViewControl: controls.streetView,
          zoomControl: controls.zoom,
          gestureHandling: 'cooperative',
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ],
          restriction: {
            latLngBounds: GOOGLE_MAPS_CONFIG.ecuadorBounds,
            strictBounds: false
          }
        })

        mapInstanceRef.current = map

        // Add markers
        await updateMarkers(map, initialMarkersRef.current)
        updateCircles(map, initialCirclesRef.current)

        setIsLoaded(true)
      } catch (err) {
        registrarError(err as Error, 'GoogleMap:initializeMap')
        setError('No se pudo cargar el mapa. Intenta de nuevo más tarde.')
      }
    }

    initializeMap()
  }, [controls.mapTypeControl, controls.streetView, controls.zoom, updateCircles, updateMarkers])

  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded || !onMapReady) return

    onMapReady(mapInstanceRef.current)
  }, [isLoaded, onMapReady])

  useEffect(() => {
    if (mapInstanceRef.current && isLoaded) {
      mapInstanceRef.current.setCenter(center)
      mapInstanceRef.current.setZoom(zoom)
    }
  }, [center, zoom, isLoaded])

  useEffect(() => {
    if (mapInstanceRef.current && isLoaded) {
      updateMarkers(mapInstanceRef.current, markers)
    }
  }, [markers, isLoaded, updateMarkers])

  useEffect(() => {
    if (mapInstanceRef.current && isLoaded) {
      updateCircles(mapInstanceRef.current, circles)
    }
  }, [circles, isLoaded, updateCircles])

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg ${className}`}
        style={{ height }}
      >
        <div className="text-center p-4">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-5.447M9 14a1 1 0 00-1.414-1.414L9 11.586V7a1 1 0 00-1.414 1.414L9 5.414z" />
          </svg>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div 
        ref={mapRef}
        style={{ height }}
        className="w-full rounded-lg overflow-hidden"
      />
      {!isLoaded && !error && (
        <div className="flex items-center justify-center bg-gray-100 rounded-lg" style={{ height }}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  )
}

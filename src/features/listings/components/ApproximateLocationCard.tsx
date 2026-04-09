'use client'

import GoogleMap, { type MapCircle } from '@/shared/components/maps/GoogleMap'
import { mostrarUbicacionSegura } from '@/lib/dominio/formatear-ubicacion'
import type { Ubicacion } from '@/shared/types/location'

type Props = {
  ubicacion?: Ubicacion
}

export default function ApproximateLocationCard({ ubicacion }: Props) {
  if (!ubicacion) return null

  const centro = {
    lat: ubicacion.coordenadas.lat,
    lng: ubicacion.coordenadas.lng,
  }

  const circulos: MapCircle[] = [
    {
      id: 'area-aproximada',
      center: centro,
      radius: 900,
      fillColor: '#2563EB',
      fillOpacity: 0.18,
      strokeColor: '#2563EB',
      strokeOpacity: 0.45,
      strokeWeight: 2,
    },
  ]

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Ubicación aproximada</h3>
        <p className="mt-1 text-sm text-gray-600">
          {mostrarUbicacionSegura(ubicacion)}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Mostramos una referencia cercana para proteger la dirección exacta del anunciante.
        </p>
      </div>

      <GoogleMap
        center={centro}
        zoom={13}
        circles={circulos}
        height="220px"
        controls={{
          zoom: true,
          streetView: false,
          mapTypeControl: false,
        }}
        className="overflow-hidden rounded-lg"
      />

      <p className="mt-3 text-xs text-gray-500">
        Área aproximada dentro de {ubicacion.direccion.ciudad}, {ubicacion.direccion.provincia}.
      </p>
    </div>
  )
}

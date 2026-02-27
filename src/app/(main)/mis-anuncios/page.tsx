'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/shared/providers/AuthProvider'
import { obtenerAnunciosPorUsuario } from '@/features/listings/services/listing-service'
import type { Anuncio } from '@/shared/types/anuncio'
import type { EstadoAnuncio } from '@/lib/dominio/estados-anuncio'
import Container from '@/shared/components/layout/Container'
import AuthGuard from '@/features/auth/components/AuthGuard'
import ListingGrid from '@/features/listings/components/ListingGrid'

const tabs: { status: EstadoAnuncio; label: string; variant: 'success' | 'warning' | 'error' }[] = [
  { status: 'aprobado', label: 'Activos', variant: 'success' },
  { status: 'pendiente', label: 'Pendientes', variant: 'warning' },
  { status: 'rechazado', label: 'Rechazados', variant: 'error' },
]

export default function MisAnunciosPage() {
  const { user } = useAuth()
  const [anuncios, setAnuncios] = useState<Anuncio[]>([])
  const [loading, setLoading] = useState(true)
  const [tabActiva, setTabActiva] = useState<EstadoAnuncio>('aprobado')

  useEffect(() => {
    if (!user) return

    async function cargar() {
      setLoading(true)
      const data = await obtenerAnunciosPorUsuario(user!.uid, tabActiva)
      setAnuncios(data)
      setLoading(false)
    }
    cargar()
  }, [user, tabActiva])

  return (
    <AuthGuard>
      <Container className="py-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Mis anuncios</h1>

        <div className="mb-6 flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.status}
              onClick={() => setTabActiva(tab.status)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                tabActiva === tab.status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <ListingGrid
          anuncios={anuncios}
          loading={loading}
          emptyMessage={`No tienes anuncios ${tabActiva === 'aprobado' ? 'activos' : tabActiva === 'pendiente' ? 'pendientes' : 'rechazados'}`}
        />
      </Container>
    </AuthGuard>
  )
}

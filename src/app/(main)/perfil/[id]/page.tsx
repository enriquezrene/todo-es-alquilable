'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Container from '@/shared/components/layout/Container'
import Spinner from '@/shared/components/ui/Spinner'
import ProfileCard from '@/features/profile/components/ProfileCard'
import ListingGrid from '@/features/listings/components/ListingGrid'
import { obtenerPerfil } from '@/features/profile/services/profile-service'
import { obtenerAnunciosPorUsuario } from '@/features/listings/services/listing-service'
import type { Usuario } from '@/shared/types/usuario'
import type { Anuncio } from '@/shared/types/anuncio'

export default function PerfilPublicoPage() {
  const params = useParams()
  const uid = params.id as string
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [anuncios, setAnuncios] = useState<Anuncio[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function cargar() {
      const [perfil, listings] = await Promise.all([
        obtenerPerfil(uid),
        obtenerAnunciosPorUsuario(uid, 'aprobado'),
      ])
      setUsuario(perfil)
      setAnuncios(listings)
      setLoading(false)
    }
    cargar()
  }, [uid])

  if (loading) {
    return (
      <Container className="py-12">
        <Spinner size="lg" />
      </Container>
    )
  }

  if (!usuario) {
    return (
      <Container className="py-12 text-center">
        <h1 className="text-xl font-semibold text-gray-900">Usuario no encontrado</h1>
      </Container>
    )
  }

  return (
    <Container className="py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <aside>
          <ProfileCard usuario={usuario} showContact />
        </aside>
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Anuncios de {usuario.displayName}
          </h2>
          <ListingGrid anuncios={anuncios} emptyMessage="Este usuario no tiene anuncios activos" />
        </div>
      </div>
    </Container>
  )
}

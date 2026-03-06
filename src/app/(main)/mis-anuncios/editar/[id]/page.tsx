'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/shared/providers/AuthProvider'
import { obtenerAnuncioPorId } from '@/features/listings/services/listing-service'
import type { Anuncio } from '@/shared/types/anuncio'
import Container from '@/shared/components/layout/Container'
import AuthGuard from '@/features/auth/components/AuthGuard'
import ListingEditForm from '@/features/listings/components/ListingEditForm'

export default function EditarAnuncioPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const router = useRouter()
  const [anuncio, setAnuncio] = useState<Anuncio | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    async function cargar() {
      const data = await obtenerAnuncioPorId(id)
      if (!data || data.ownerId !== user!.uid) {
        router.push('/mis-anuncios')
        return
      }
      setAnuncio(data)
      setLoading(false)
    }
    cargar()
  }, [id, user, router])

  if (loading) {
    return (
      <Container className="py-8">
        <div className="text-center text-gray-500">Cargando anuncio...</div>
      </Container>
    )
  }

  return (
    <AuthGuard>
      <Container className="py-8">
        <h1 className="mb-8 text-center text-2xl font-bold text-gray-900">Editar anuncio</h1>
        {anuncio?.rejectionReason && (
          <div className="mx-auto mb-6 max-w-2xl rounded-lg bg-orange-50 p-4">
            <p className="text-sm font-medium text-orange-800">Cambios solicitados por el moderador:</p>
            <p className="mt-1 text-sm text-orange-700">{anuncio.rejectionReason}</p>
          </div>
        )}
        {anuncio && <ListingEditForm anuncio={anuncio} />}
      </Container>
    </AuthGuard>
  )
}

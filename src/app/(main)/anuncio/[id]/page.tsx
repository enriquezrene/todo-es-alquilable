'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/shared/providers/AuthProvider'
import Container from '@/shared/components/layout/Container'
import Spinner from '@/shared/components/ui/Spinner'
import Badge from '@/shared/components/ui/Badge'
import Button from '@/shared/components/ui/Button'
import PhotoGallery from '@/features/listings/components/PhotoGallery'
import RentalRequestButton from '@/features/rentals/components/RentalRequestButton'
import RentalManagementPanel from '@/features/rentals/components/RentalManagementPanel'
import ListingGrid from '@/features/listings/components/ListingGrid'
import { obtenerAnuncioPorId, incrementarVistas, obtenerAnunciosAprobados } from '@/features/listings/services/listing-service'
import { etiquetasCondicion, type CondicionArticulo } from '@/lib/dominio/condiciones-articulo'
import { formatearPrecio } from '@/lib/dominio/formatear-precio'
import { formatearFecha } from '@/lib/dominio/formatear-fecha'
import { registrarError } from '@/lib/registrar-error'
import type { Anuncio } from '@/shared/types/anuncio'

export default function AnuncioDetallePage() {
  const params = useParams()
  const { user } = useAuth()
  const id = params.id as string
  const [anuncio, setAnuncio] = useState<Anuncio | null>(null)
  const [similares, setSimilares] = useState<Anuncio[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function cargar() {
      setLoading(true)
      try {
        const data = await obtenerAnuncioPorId(id)
        setAnuncio(data)

        if (data) {
          // Increment views silently - don't show errors to users if this fails
          incrementarVistas(id).catch(() => {
            // Silently fail - view count is not critical for user experience
          })

          const { anuncios } = await obtenerAnunciosAprobados(4)
          setSimilares(anuncios.filter((a) => a.id !== id).slice(0, 4))
        }
      } catch (e) {
        registrarError(e, 'AnuncioPage:cargar')
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [id])

  if (loading) {
    return (
      <Container className="py-12">
        <Spinner size="lg" />
      </Container>
    )
  }

  if (!anuncio) {
    return (
      <Container className="py-12 text-center">
        <h1 className="text-xl font-semibold text-gray-900">Anuncio no encontrado</h1>
      </Container>
    )
  }

  return (
    <Container className="py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PhotoGallery images={anuncio.images} title={anuncio.title} />

          <div className="mt-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{anuncio.categoryName}</Badge>
              <Badge variant="info">{etiquetasCondicion[anuncio.condition as CondicionArticulo]}</Badge>
              <Badge variant={anuncio.availabilityStatus === 'disponible' ? 'success' : 'warning'}>
                {anuncio.availabilityStatus === 'disponible' ? 'Disponible' : 'Alquilado'}
              </Badge>
              <span className="text-sm text-gray-500">{anuncio.province}</span>
            </div>

            <h1 className="mt-3 text-2xl font-bold text-gray-900">{anuncio.title}</h1>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {formatearPrecio(anuncio.price, anuncio.priceUnit)}
            </p>

            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900">Descripción</h2>
              <p className="mt-2 whitespace-pre-wrap text-gray-600">{anuncio.description}</p>
            </div>

            <p className="mt-4 text-sm text-gray-400">
              Publicado el {formatearFecha(anuncio.createdAt)} &middot; {anuncio.viewCount} vistas
            </p>
          </div>
        </div>

        <div>
          <div className="sticky top-20 space-y-4">
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-medium">
                  {anuncio.ownerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{anuncio.ownerName}</p>
                  <p className="text-sm text-gray-500">{anuncio.province}</p>
                </div>
              </div>
            </div>

            <RentalRequestButton anuncio={anuncio} />
            
            {user && user.uid === anuncio.ownerId && (
              <>
                <Link href={`/mis-anuncios/editar/${anuncio.id}`} className="block w-full">
                  <Button variant="outline" size="sm" className="w-full">
                    Editar anuncio
                  </Button>
                </Link>
                <RentalManagementPanel anuncio={anuncio} />
              </>
            )}
          </div>
        </div>
      </div>

      {similares.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Anuncios similares</h2>
          <ListingGrid anuncios={similares} />
        </div>
      )}
    </Container>
  )
}

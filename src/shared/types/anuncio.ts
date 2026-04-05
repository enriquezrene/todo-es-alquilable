import type { EstadoAnuncio } from '@/lib/dominio/estados-anuncio'
import type { UnidadPrecio } from '@/lib/dominio/unidades-precio'
import type { CondicionArticulo } from '@/lib/dominio/condiciones-articulo'
import type { EstadoDisponibilidad } from '@/features/rentals/types'

export type Anuncio = {
  id: string
  title: string
  titleLower: string
  description: string
  categoryId: string
  categoryName: string
  condition: CondicionArticulo
  price: number
  priceUnit: UnidadPrecio
  province: string
  images: string[]
  thumbnails: string[]
  ownerId: string
  ownerName: string
  ownerPhone?: string // Optional for backward compatibility - will be removed in future
  ownerPhotoURL: string | null
  status: EstadoAnuncio
  rejectionReason: string | null
  moderatorId: string | null
  moderatedAt: Date | null
  viewCount: number
  availabilityStatus: EstadoDisponibilidad
  createdAt: Date
  updatedAt: Date
}

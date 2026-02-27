import type { CondicionArticulo } from '@/lib/dominio/condiciones-articulo'
import type { UnidadPrecio } from '@/lib/dominio/unidades-precio'

export type FormularioAnuncio = {
  title: string
  description: string
  categoryId: string
  categoryName: string
  suggestedCategory: string
  condition: CondicionArticulo | ''
  price: string
  priceUnit: UnidadPrecio | ''
  province: string
  images: File[]
  imagesPreviews: string[]
}

export type PasoFormulario = 'categoria' | 'fotos' | 'detalles' | 'precio' | 'revision'

export const PASOS_FORMULARIO: PasoFormulario[] = [
  'categoria',
  'fotos',
  'detalles',
  'precio',
  'revision',
]

export const ETIQUETAS_PASO: Record<PasoFormulario, string> = {
  categoria: 'Categoría',
  fotos: 'Fotos',
  detalles: 'Detalles',
  precio: 'Precio',
  revision: 'Revisión',
}

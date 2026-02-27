export type Categoria = {
  id: string
  name: string
  nameLower: string
  icon: string
  listingCount: number
  isActive: boolean
  createdAt: Date
}

export type CategoriaSugerida = {
  id: string
  name: string
  suggestedBy: string
  status: 'pendiente' | 'aprobada' | 'rechazada'
  createdAt: Date
}

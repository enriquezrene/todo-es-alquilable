export type AccionModeracion = 'aprobar' | 'rechazar' | 'solicitar_cambios'

export type ReporteAnuncio = {
  id: string
  listingId: string
  reportedBy: string
  reason: string
  status: 'pendiente' | 'resuelto' | 'descartado'
  createdAt: Date
}

export const ESTADOS_REVIEW = {
  PENDIENTE: 'pending',
  APROBADO: 'approved',
  RECHAZADO: 'rejected'
} as const

export type EstadoReview = typeof ESTADOS_REVIEW[keyof typeof ESTADOS_REVIEW]

export const etiquetasEstadoReview: Record<EstadoReview, string> = {
  [ESTADOS_REVIEW.PENDIENTE]: 'Pendiente',
  [ESTADOS_REVIEW.APROBADO]: 'Aprobado',
  [ESTADOS_REVIEW.RECHAZADO]: 'Rechazado'
}

export const coloresEstadoReview: Record<EstadoReview, string> = {
  [ESTADOS_REVIEW.PENDIENTE]: 'bg-yellow-100 text-yellow-800',
  [ESTADOS_REVIEW.APROBADO]: 'bg-green-100 text-green-800',
  [ESTADOS_REVIEW.RECHAZADO]: 'bg-red-100 text-red-800'
}

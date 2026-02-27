export const ESTADOS_ANUNCIO = {
  PENDIENTE: 'pendiente',
  APROBADO: 'aprobado',
  RECHAZADO: 'rechazado',
  CAMBIOS_REQUERIDOS: 'cambios_requeridos',
} as const

export type EstadoAnuncio = (typeof ESTADOS_ANUNCIO)[keyof typeof ESTADOS_ANUNCIO]

export const etiquetasEstado: Record<EstadoAnuncio, string> = {
  pendiente: 'Pendiente de revisión',
  aprobado: 'Aprobado',
  rechazado: 'Rechazado',
  cambios_requeridos: 'Cambios requeridos',
}

export const coloresEstado: Record<EstadoAnuncio, string> = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  aprobado: 'bg-green-100 text-green-800',
  rechazado: 'bg-red-100 text-red-800',
  cambios_requeridos: 'bg-orange-100 text-orange-800',
}

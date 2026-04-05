export const ESTADOS_RENTA = {
  ACTIVA: 'active',
  COMPLETADA: 'completed',
  CANCELADA: 'cancelled'
} as const

export type EstadoRenta = typeof ESTADOS_RENTA[keyof typeof ESTADOS_RENTA]

export const etiquetasEstadoRenta: Record<EstadoRenta, string> = {
  [ESTADOS_RENTA.ACTIVA]: 'Activa',
  [ESTADOS_RENTA.COMPLETADA]: 'Completada',
  [ESTADOS_RENTA.CANCELADA]: 'Cancelada'
}

export const coloresEstadoRenta: Record<EstadoRenta, string> = {
  [ESTADOS_RENTA.ACTIVA]: 'bg-green-100 text-green-800',
  [ESTADOS_RENTA.COMPLETADA]: 'bg-blue-100 text-blue-800',
  [ESTADOS_RENTA.CANCELADA]: 'bg-red-100 text-red-800'
}

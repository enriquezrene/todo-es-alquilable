export const ESTADOS_PERFIL = {
  PENDIENTE: 'pending',
  APROBADO: 'approved',
  RECHAZADO: 'rejected'
} as const

export type EstadoPerfil = typeof ESTADOS_PERFIL[keyof typeof ESTADOS_PERFIL]

export const etiquetasEstadoPerfil: Record<EstadoPerfil, string> = {
  [ESTADOS_PERFIL.PENDIENTE]: 'Pendiente de aprobación',
  [ESTADOS_PERFIL.APROBADO]: 'Aprobado',
  [ESTADOS_PERFIL.RECHAZADO]: 'Rechazado'
}

export const coloresEstadoPerfil: Record<EstadoPerfil, string> = {
  [ESTADOS_PERFIL.PENDIENTE]: 'bg-yellow-100 text-yellow-800',
  [ESTADOS_PERFIL.APROBADO]: 'bg-green-100 text-green-800',
  [ESTADOS_PERFIL.RECHAZADO]: 'bg-red-100 text-red-800'
}

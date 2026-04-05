export const ESTADOS_SOLICITUD = {
  PENDIENTE: 'pendiente',
  APROBADA: 'aprobada',
  RECHAZADA: 'rechazada',
} as const

export type EstadoSolicitud = (typeof ESTADOS_SOLICITUD)[keyof typeof ESTADOS_SOLICITUD]

export const ESTADOS_DISPONIBILIDAD = {
  DISPONIBLE: 'disponible',
  ALQUILADO: 'alquilado',
} as const

export type EstadoDisponibilidad = (typeof ESTADOS_DISPONIBILIDAD)[keyof typeof ESTADOS_DISPONIBILIDAD]

export type SolicitudRenta = {
  id: string
  listingId: string
  listingTitle: string
  renterId: string
  renterName: string
  renterEmail: string
  renterPhone: string
  startDateTime: Date
  endDateTime: Date
  notes: string
  status: EstadoSolicitud
  createdAt: Date
  updatedAt: Date
}

export type FormularioSolicitud = {
  startDateTime: string
  endDateTime: string
  notes: string
}

export type ErroresFormularioSolicitud = Record<keyof FormularioSolicitud, string>

export type FormularioMarcarAlquilado = {
  startDateTime: string
  endDateTime: string
  renterEmail: string
}

export type ErroresFormularioMarcarAlquilado = Record<keyof FormularioMarcarAlquilado, string>

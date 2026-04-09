import type { Ubicacion } from '@/shared/types/location'

export type FormularioPerfil = {
  displayName: string
  phone: string
  province: string
  city: string
  address: string
  ubicacion?: Ubicacion
}

export type ErroresFormulario = {
  [key: string]: string
}

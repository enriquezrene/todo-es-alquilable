import type { Ubicacion } from '@/shared/types/location'

export const formatearUbicacion = (ubicacion?: Ubicacion): string => {
  if (!ubicacion) return ''
  
  const { direccion } = ubicacion
  const { ciudad, provincia } = direccion
  
  if (ciudad && provincia) {
    return `${ciudad}, ${provincia}`
  } else if (provincia) {
    return provincia
  } else if (ciudad) {
    return ciudad
  }
  
  return ''
}

export const mostrarUbicacionSegura = (ubicacion?: Ubicacion): string => {
  if (!ubicacion) return ''
  
  const { direccion } = ubicacion
  return `${direccion.ciudad}, ${direccion.provincia}`
}

export const tieneUbicacion = (ubicacion?: Ubicacion): boolean => {
  return Boolean(
    ubicacion &&
    ubicacion.coordenadas.lat &&
    ubicacion.coordenadas.lng &&
    ubicacion.direccion.ciudad.trim().length > 0 &&
    ubicacion.direccion.provincia.trim().length > 0
  )
}

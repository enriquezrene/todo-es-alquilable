import type { Ubicacion } from '@/shared/types/location'

const PRECISION_COORDENADAS_APROXIMADAS = 2

export const redondearCoordenada = (valor: number, precision: number = PRECISION_COORDENADAS_APROXIMADAS): number => {
  return Number(valor.toFixed(precision))
}

export const obtenerUbicacionAproximada = (ubicacion?: Ubicacion | null): Ubicacion | undefined => {
  if (!ubicacion) return undefined

  const { coordenadas, direccion, timestamp } = ubicacion
  const direccionAproximada = [direccion.ciudad, direccion.provincia, direccion.pais]
    .filter((valor) => valor.trim().length > 0)
    .join(', ')

  return {
    coordenadas: {
      lat: redondearCoordenada(coordenadas.lat),
      lng: redondearCoordenada(coordenadas.lng),
    },
    direccion: {
      ...direccion,
      calle: '',
      direccionCompleta: direccionAproximada,
    },
    timestamp,
  }
}

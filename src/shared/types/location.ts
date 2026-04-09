export type Coordenadas = {
  lat: number
  lng: number
}

export type Direccion = {
  direccionCompleta: string
  calle: string
  ciudad: string
  provincia: string
  pais: string
  codigoPostal?: string
}

export type Ubicacion = {
  coordenadas: Coordenadas
  direccion: Direccion
  timestamp: Date
}

export type ResultadoGeocoding = {
  coordenadas: Coordenadas
  direccion: Direccion
  lugarId?: string
  tipos: string[]
  precision: 'precisa' | 'aproximada'
}

export type SugerenciaLugar = {
  lugarId: string
  descripcion: string
  terminosCoincidentes: string[]
}

export type ConfiguracionMapa = {
  centro: Coordenadas
  zoom: number
  marcadores: MarcadorMapa[]
  controles: {
    zoom: boolean
    streetView: boolean
    mapTypeControl: boolean
  }
}

export type MarcadorMapa = {
  id: string
  posicion: Coordenadas
  titulo?: string
  descripcion?: string
  tipo: 'usuario' | 'articulo' | 'seleccion'
}

export type ErrorUbicacion = {
  codigo: 'SIN_API_KEY' | 'SIN_PERMISO' | 'SIN_RESULTADOS' | 'ERROR_RED' | 'ERROR_SERVIDOR'
  mensaje: string
  detalles?: string
}

// Utilidades de validación
export const esCoordenadasValidas = (coordenadas: Coordenadas): boolean => {
  return (
    typeof coordenadas.lat === 'number' &&
    typeof coordenadas.lng === 'number' &&
    coordenadas.lat >= -90 &&
    coordenadas.lat <= 90 &&
    coordenadas.lng >= -180 &&
    coordenadas.lng <= 180 &&
    !isNaN(coordenadas.lat) &&
    !isNaN(coordenadas.lng)
  )
}

export const esDireccionCompleta = (direccion: Direccion): boolean => {
  return (
    Boolean(direccion.direccionCompleta.trim()) &&
    Boolean(direccion.ciudad.trim()) &&
    Boolean(direccion.provincia.trim()) &&
    Boolean(direccion.pais.trim())
  )
}

export const esUbicacionValida = (ubicacion: Ubicacion): boolean => {
  return (
    esCoordenadasValidas(ubicacion.coordenadas) &&
    esDireccionCompleta(ubicacion.direccion) &&
    ubicacion.timestamp instanceof Date
  )
}

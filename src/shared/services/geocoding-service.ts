import { registrarError } from '@/lib/registrar-error'

export interface Coordenadas {
  lat: number
  lng: number
}

export interface Direccion {
  direccionCompleta: string
  ciudad?: string
  provincia?: string
  pais?: string
  codigoPostal?: string
}

export interface Ubicacion extends Coordenadas, Direccion {}

export interface ResultadoGeocoding {
  ubicacion: Ubicacion
  precision: string
  tipos: string[]
}

export interface SugerenciaLugar {
  lugarId: string
  descripcion: string
  terminosCoincidentes: string[]
}

export interface ErrorUbicacion extends Error {
  codigo: string
  tipo: string
}

class GeocodingService {
  private apiKey: string
  private baseUrl = 'https://maps.googleapis.com/maps/api'

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
    
    if (!this.apiKey) {
      console.warn('Google Maps API key is not configured. Geocoding features will be disabled.')
    }
  }

  private async hacerRequest(endpoint: string, params: Record<string, string>): Promise<unknown> {
    if (!this.apiKey) {
      throw new Error('Google Maps API key is not configured')
    }

    // Use proxy API to avoid CORS issues
    const url = new URL(`/api/maps/proxy?endpoint=${endpoint.replace('/maps/api/', '')}`, 'http://localhost:3000')
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })

    try {
      const response = await fetch(url.toString())
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        throw new Error(`Google Maps API error: ${data.status} - ${data.error_message || 'Unknown error'}`)
      }

      return data
    } catch (error) {
      registrarError(error as Error, 'GeocodingService:hacerRequest')
      throw error
    }
  }

  async geocodificarDireccion(direccion: string): Promise<ResultadoGeocoding> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await this.hacerRequest('/geocode/json', {
        address: direccion,
        components: 'country:EC'
      }) as any

      if (data.status === 'ZERO_RESULTS') {
        throw new Error('No se encontraron resultados para la dirección')
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resultado = data.results[0]
      const ubicacion = this.procesarResultadoGeocoding(resultado)

      return {
        ubicacion,
        precision: resultado.geometry.location_type,
        tipos: resultado.types
      }
    } catch (error) {
      registrarError(error as Error, 'GeocodingService:geocodificarDireccion')
      throw error
    }
  }

  async geocodificarInverso(coordenadas: Coordenadas): Promise<ResultadoGeocoding> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await this.hacerRequest('/geocode/json', {
        latlng: `${coordenadas.lat},${coordenadas.lng}`
      }) as any

      if (data.status === 'ZERO_RESULTS') {
        throw new Error('No se encontraron resultados para las coordenadas')
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resultado = data.results[0]
      const ubicacion = this.procesarResultadoGeocoding(resultado)

      return {
        ubicacion,
        precision: resultado.geometry.location_type,
        tipos: resultado.types
      }
    } catch (error) {
      registrarError(error as Error, 'GeocodingService:geocodificarInverso')
      throw error
    }
  }

  async obtenerSugerencias(input: string): Promise<SugerenciaLugar[]> {
    if (!input || input.length < 3) return []

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await this.hacerRequest('/place/autocomplete/json', {
        input,
        components: 'country:EC',
        types: 'address'
      }) as any

      if (data.status === 'ZERO_RESULTS') {
        return []
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.predictions.map((prediction: any) => ({
        lugarId: prediction.place_id,
        descripcion: prediction.description,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        terminosCoincidentes: prediction.terms?.map((term: any) => term.value) || []
      }))
    } catch (error) {
      registrarError(error as Error, 'GeocodingService:obtenerSugerencias')
      throw error
    }
  }

  async obtenerDetallesLugar(lugarId: string): Promise<ResultadoGeocoding> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await this.hacerRequest('/place/details/json', {
        place_id: lugarId,
        fields: 'geometry,address_components,formatted_address,types'
      }) as any

      if (data.status === 'ZERO_RESULTS') {
        throw new Error('No se encontraron detalles para el lugar')
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resultado = data.result
      const ubicacion = this.procesarResultadoPlaces(resultado)

      return {
        ubicacion,
        precision: 'high',
        tipos: resultado.types
      }
    } catch (error) {
      registrarError(error as Error, 'GeocodingService:obtenerDetallesLugar')
      throw error
    }
  }

  private procesarResultadoGeocoding(resultado: unknown): Ubicacion {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = resultado as any
    const location = result.geometry.location
    const addressComponents = result.address_components || []

    const ciudad = this.extraerCiudad(addressComponents)
    const provincia = this.extraerProvincia(addressComponents)
    const pais = this.extraerPais(addressComponents)
    const codigoPostal = this.extraerCodigoPostal(addressComponents)

    return {
      lat: location.lat,
      lng: location.lng,
      direccionCompleta: result.formatted_address,
      ciudad,
      provincia,
      pais,
      codigoPostal
    }
  }

  private procesarResultadoPlaces(resultado: unknown): Ubicacion {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = resultado as any
    const location = result.geometry.location
    const addressComponents = result.address_components || []

    const ciudad = this.extraerCiudad(addressComponents)
    const provincia = this.extraerProvincia(addressComponents)
    const pais = this.extraerPais(addressComponents)
    const codigoPostal = this.extraerCodigoPostal(addressComponents)

    return {
      lat: location.lat,
      lng: location.lng,
      direccionCompleta: result.formatted_address,
      ciudad,
      provincia,
      pais,
      codigoPostal
    }
  }

  private extraerDireccion(components: unknown[]): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const comps = components as any[]
    const streetNumber = comps.find(c => c.types.includes('street_number'))?.long_name
    const route = comps.find(c => c.types.includes('route'))?.long_name
    
    if (streetNumber && route) {
      return `${route} ${streetNumber}`
    }
    
    return route || ''
  }

  private extraerCiudad(components: unknown[]): string | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const comps = components as any[]
    return comps.find(c => 
      c.types.includes('locality') || 
      c.types.includes('administrative_area_level_2')
    )?.long_name
  }

  private extraerProvincia(components: unknown[]): string | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const comps = components as any[]
    return comps.find(c => 
      c.types.includes('administrative_area_level_1')
    )?.long_name
  }

  private extraerPais(components: unknown[]): string | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const comps = components as any[]
    return comps.find(c => c.types.includes('country'))?.long_name
  }

  private extraerCodigoPostal(components: unknown[]): string | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const comps = components as any[]
    return comps.find(c => c.types.includes('postal_code'))?.long_name
  }

  // Utility method to validate coordinates
  esCoordenadaValida(coordenadas: Coordenadas): boolean {
    return (
      typeof coordenadas.lat === 'number' &&
      typeof coordenadas.lng === 'number' &&
      coordenadas.lat >= -90 &&
      coordenadas.lat <= 90 &&
      coordenadas.lng >= -180 &&
      coordenadas.lng <= 180
    )
  }

  // Utility method to check if location is in Ecuador
  estaEnEcuador(coordenadas: Coordenadas): boolean {
    return (
      coordenadas.lat >= -5.0 &&
      coordenadas.lat <= 2.0 &&
      coordenadas.lng >= -81.0 &&
      coordenadas.lng <= -75.0
    )
  }
}

// Singleton instance
export const geocodingService = new GeocodingService()

// Export convenience methods
export const geocodificarDireccion = (direccion: string) => geocodingService.geocodificarDireccion(direccion)
export const geocodificarInverso = (coordenadas: Coordenadas) => geocodingService.geocodificarInverso(coordenadas)
export const obtenerSugerencias = (input: string) => geocodingService.obtenerSugerencias(input)
export const obtenerDetallesLugar = (lugarId: string) => geocodingService.obtenerDetallesLugar(lugarId)
export const esCoordenadaValida = (coordenadas: Coordenadas) => geocodingService.esCoordenadaValida(coordenadas)
export const estaEnEcuador = (coordenadas: Coordenadas) => geocodingService.estaEnEcuador(coordenadas)

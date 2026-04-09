import { describe, expect, it } from 'vitest'
import { obtenerUbicacionAproximada, redondearCoordenada } from './obtener-ubicacion-aproximada'
import type { Ubicacion } from '@/shared/types/location'

describe('redondearCoordenada', () => {
  it('redondea la coordenada a dos decimales', () => {
    expect(redondearCoordenada(-78.4678123)).toBe(-78.47)
  })
})

describe('obtenerUbicacionAproximada', () => {
  it('retorna undefined cuando no hay ubicación', () => {
    expect(obtenerUbicacionAproximada()).toBeUndefined()
  })

  it('convierte una ubicación exacta en una ubicación aproximada', () => {
    const ubicacion: Ubicacion = {
      coordenadas: {
        lat: -0.180653,
        lng: -78.467834,
      },
      direccion: {
        direccionCompleta: 'Av. Amazonas N34-451, Quito, Pichincha, Ecuador',
        calle: 'Av. Amazonas N34-451',
        ciudad: 'Quito',
        provincia: 'Pichincha',
        pais: 'Ecuador',
      },
      timestamp: new Date('2024-01-15T12:00:00.000Z'),
    }

    expect(obtenerUbicacionAproximada(ubicacion)).toEqual({
      coordenadas: {
        lat: -0.18,
        lng: -78.47,
      },
      direccion: {
        direccionCompleta: 'Quito, Pichincha, Ecuador',
        calle: '',
        ciudad: 'Quito',
        provincia: 'Pichincha',
        pais: 'Ecuador',
      },
      timestamp: new Date('2024-01-15T12:00:00.000Z'),
    })
  })
})

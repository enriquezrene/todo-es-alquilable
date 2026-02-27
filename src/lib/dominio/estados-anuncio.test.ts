import { describe, it, expect } from 'vitest'
import { ESTADOS_ANUNCIO, etiquetasEstado, coloresEstado } from './estados-anuncio'

describe('ESTADOS_ANUNCIO', () => {
  it('tiene los 4 estados esperados', () => {
    expect(Object.keys(ESTADOS_ANUNCIO)).toHaveLength(4)
    expect(ESTADOS_ANUNCIO.PENDIENTE).toBe('pendiente')
    expect(ESTADOS_ANUNCIO.APROBADO).toBe('aprobado')
    expect(ESTADOS_ANUNCIO.RECHAZADO).toBe('rechazado')
    expect(ESTADOS_ANUNCIO.CAMBIOS_REQUERIDOS).toBe('cambios_requeridos')
  })

  it('cada estado tiene etiqueta', () => {
    Object.values(ESTADOS_ANUNCIO).forEach((estado) => {
      expect(etiquetasEstado[estado]).toBeTruthy()
    })
  })

  it('cada estado tiene clase de color', () => {
    Object.values(ESTADOS_ANUNCIO).forEach((estado) => {
      expect(coloresEstado[estado]).toBeTruthy()
    })
  })
})

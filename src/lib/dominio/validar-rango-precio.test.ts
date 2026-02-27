import { describe, it, expect } from 'vitest'
import { validarRangoPrecio } from './validar-rango-precio'

describe('validarRangoPrecio', () => {
  it('acepta rango válido', () => {
    expect(validarRangoPrecio(10, 100)).toBeNull()
  })

  it('acepta solo precio mínimo', () => {
    expect(validarRangoPrecio(10, undefined)).toBeNull()
  })

  it('acepta solo precio máximo', () => {
    expect(validarRangoPrecio(undefined, 100)).toBeNull()
  })

  it('acepta sin precios', () => {
    expect(validarRangoPrecio(undefined, undefined)).toBeNull()
  })

  it('rechaza precio mínimo negativo', () => {
    expect(validarRangoPrecio(-5, 100)).toBeTruthy()
  })

  it('rechaza precio máximo negativo', () => {
    expect(validarRangoPrecio(10, -5)).toBeTruthy()
  })

  it('rechaza mínimo mayor que máximo', () => {
    expect(validarRangoPrecio(100, 10)).toBeTruthy()
  })

  it('acepta mínimo igual a máximo', () => {
    expect(validarRangoPrecio(50, 50)).toBeNull()
  })
})

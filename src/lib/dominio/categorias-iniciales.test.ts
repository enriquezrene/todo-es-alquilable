import { describe, it, expect } from 'vitest'
import { categoriasIniciales } from './categorias-iniciales'

describe('categoriasIniciales', () => {
  it('contiene 12 categorías', () => {
    expect(categoriasIniciales).toHaveLength(12)
  })

  it('cada categoría tiene nombre e icono', () => {
    categoriasIniciales.forEach((cat) => {
      expect(cat.nombre).toBeTruthy()
      expect(cat.icono).toBeTruthy()
    })
  })

  it('incluye Herramientas', () => {
    expect(categoriasIniciales.find((c) => c.nombre === 'Herramientas')).toBeDefined()
  })

  it('no tiene nombres duplicados', () => {
    const nombres = categoriasIniciales.map((c) => c.nombre)
    expect(new Set(nombres).size).toBe(nombres.length)
  })
})

import { describe, it, expect } from 'vitest'
import { parseSearchParams } from './types'

describe('parseSearchParams', () => {
  it('parsea parámetros con valores', () => {
    const result = parseSearchParams({
      q: 'taladro',
      categoria: 'cat-1',
      provincia: 'Pichincha',
      precioMin: '10',
      precioMax: '50',
      orden: 'precio_asc',
      pagina: '2',
    })

    expect(result).toEqual({
      query: 'taladro',
      categoryId: 'cat-1',
      province: 'Pichincha',
      priceMin: 10,
      priceMax: 50,
      sortBy: 'precio_asc',
      page: 2,
    })
  })

  it('usa defaults para parámetros vacíos', () => {
    const result = parseSearchParams({})

    expect(result).toEqual({
      query: '',
      categoryId: '',
      province: '',
      priceMin: undefined,
      priceMax: undefined,
      sortBy: 'reciente',
      page: 1,
    })
  })
})

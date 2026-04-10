import { describe, expect, it } from 'vitest'
import { construirUrlGoogleMaps } from './construir-url-google-maps'

describe('construirUrlGoogleMaps', () => {
  it('no restringe autocomplete solo a direcciones', () => {
    const url = construirUrlGoogleMaps({
      endpoint: 'place/autocomplete/json',
      apiKey: 'fake-key',
      query: 'Llano Chico',
      lat: null,
      lng: null,
      address: null,
    })

    expect(url).toContain('place/autocomplete/json')
    expect(url).toContain('input=Llano%20Chico')
    expect(url).toContain('components=country:EC')
    expect(url).not.toContain('types=address')
  })

  it('mantiene la restriccion a Ecuador para geocodificar direcciones', () => {
    const url = construirUrlGoogleMaps({
      endpoint: 'geocode/json',
      apiKey: 'fake-key',
      query: null,
      lat: null,
      lng: null,
      address: 'Llano Chico, Quito',
    })

    expect(url).toContain('geocode/json')
    expect(url).toContain('address=Llano%20Chico%2C%20Quito')
    expect(url).toContain('components=country:EC')
  })
})

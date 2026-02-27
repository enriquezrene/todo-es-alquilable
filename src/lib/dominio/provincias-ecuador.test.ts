import { describe, it, expect } from 'vitest'
import { provinciasEcuador, obtenerCiudadesPorProvincia, obtenerNombresProvincias } from './provincias-ecuador'

describe('provinciasEcuador', () => {
  it('contiene las 24 provincias', () => {
    expect(provinciasEcuador).toHaveLength(24)
  })

  it('cada provincia tiene nombre y al menos una ciudad', () => {
    provinciasEcuador.forEach((provincia) => {
      expect(provincia.nombre).toBeTruthy()
      expect(provincia.ciudades.length).toBeGreaterThan(0)
    })
  })

  it('incluye Pichincha con Quito', () => {
    const pichincha = provinciasEcuador.find((p) => p.nombre === 'Pichincha')
    expect(pichincha).toBeDefined()
    expect(pichincha!.ciudades).toContain('Quito')
  })

  it('incluye Guayas con Guayaquil', () => {
    const guayas = provinciasEcuador.find((p) => p.nombre === 'Guayas')
    expect(guayas).toBeDefined()
    expect(guayas!.ciudades).toContain('Guayaquil')
  })
})

describe('obtenerCiudadesPorProvincia', () => {
  it('retorna ciudades de una provincia existente', () => {
    const ciudades = obtenerCiudadesPorProvincia('Azuay')
    expect(ciudades).toContain('Cuenca')
  })

  it('retorna array vacío para provincia inexistente', () => {
    expect(obtenerCiudadesPorProvincia('Inexistente')).toEqual([])
  })
})

describe('obtenerNombresProvincias', () => {
  it('retorna 24 nombres', () => {
    expect(obtenerNombresProvincias()).toHaveLength(24)
  })

  it('retorna strings', () => {
    obtenerNombresProvincias().forEach((nombre) => {
      expect(typeof nombre).toBe('string')
    })
  })
})

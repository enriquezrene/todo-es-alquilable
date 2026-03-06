import { describe, it, expect } from 'vitest'
import {
  validarPasoCategoria,
  validarPasoFotos,
  validarPasoDetalles,
  validarPasoPrecio,
} from './validar-anuncio'
import type { FormularioAnuncio } from '../types'

const formularioBase: FormularioAnuncio = {
  title: 'Taladro eléctrico Bosch profesional',
  description: 'Taladro eléctrico en perfecto estado, ideal para uso doméstico y profesional.',
  categoryId: 'cat-1',
  categoryName: 'Herramientas',
  suggestedCategory: '',
  condition: 'buen_estado',
  price: '15',
  priceUnit: 'dia',
  province: 'Pichincha',
  imageSlots: [],
}

const crearSlotNuevo = (file?: File) => ({
  tipo: 'nueva' as const,
  file: file || new File([''], 'test.jpg'),
  preview: '',
})

describe('validarPasoCategoria', () => {
  it('pasa con categoría seleccionada', () => {
    expect(Object.keys(validarPasoCategoria(formularioBase))).toHaveLength(0)
  })

  it('pasa con categoría sugerida', () => {
    const datos = { ...formularioBase, categoryId: '', suggestedCategory: 'Mascotas' }
    expect(Object.keys(validarPasoCategoria(datos))).toHaveLength(0)
  })

  it('falla sin categoría ni sugerencia', () => {
    const datos = { ...formularioBase, categoryId: '', suggestedCategory: '' }
    expect(validarPasoCategoria(datos).categoryId).toBeTruthy()
  })
})

describe('validarPasoFotos', () => {
  it('falla sin fotos', () => {
    expect(validarPasoFotos(formularioBase).images).toBeTruthy()
  })

  it('pasa con fotos', () => {
    const datos = { ...formularioBase, imageSlots: [crearSlotNuevo()] }
    expect(Object.keys(validarPasoFotos(datos))).toHaveLength(0)
  })

  it('falla con más de 3 fotos', () => {
    const imageSlots = Array.from({ length: 4 }, () => crearSlotNuevo())
    const datos = { ...formularioBase, imageSlots }
    expect(validarPasoFotos(datos).images).toBeTruthy()
  })

  it('falla con imagen mayor a 5MB', () => {
    const bigFile = new File([new ArrayBuffer(6 * 1024 * 1024)], 'big.jpg')
    const datos = { ...formularioBase, imageSlots: [crearSlotNuevo(bigFile)] }
    expect(validarPasoFotos(datos).images).toBeTruthy()
  })

  it('no valida tamaño de slots existentes', () => {
    const datos = {
      ...formularioBase,
      imageSlots: [{ tipo: 'existente' as const, url: 'https://example.com/img.jpg', thumbnail: 'https://example.com/thumb.jpg' }],
    }
    expect(Object.keys(validarPasoFotos(datos))).toHaveLength(0)
  })
})

describe('validarPasoDetalles', () => {
  it('pasa con datos válidos', () => {
    expect(Object.keys(validarPasoDetalles(formularioBase))).toHaveLength(0)
  })

  it('falla con título corto', () => {
    const datos = { ...formularioBase, title: 'Corto' }
    expect(validarPasoDetalles(datos).title).toBeTruthy()
  })

  it('falla con título largo', () => {
    const datos = { ...formularioBase, title: 'A'.repeat(101) }
    expect(validarPasoDetalles(datos).title).toBeTruthy()
  })

  it('falla con descripción corta', () => {
    const datos = { ...formularioBase, description: 'Muy corta' }
    expect(validarPasoDetalles(datos).description).toBeTruthy()
  })

  it('falla sin condición', () => {
    const datos = { ...formularioBase, condition: '' as const }
    expect(validarPasoDetalles(datos).condition).toBeTruthy()
  })
})

describe('validarPasoPrecio', () => {
  it('pasa con datos válidos', () => {
    expect(Object.keys(validarPasoPrecio(formularioBase))).toHaveLength(0)
  })

  it('falla sin precio', () => {
    const datos = { ...formularioBase, price: '' }
    expect(validarPasoPrecio(datos).price).toBeTruthy()
  })

  it('falla con precio negativo', () => {
    const datos = { ...formularioBase, price: '-5' }
    expect(validarPasoPrecio(datos).price).toBeTruthy()
  })

  it('falla sin unidad de precio', () => {
    const datos = { ...formularioBase, priceUnit: '' as const }
    expect(validarPasoPrecio(datos).priceUnit).toBeTruthy()
  })

  it('falla sin provincia', () => {
    const datos = { ...formularioBase, province: '' }
    expect(validarPasoPrecio(datos).province).toBeTruthy()
  })
})

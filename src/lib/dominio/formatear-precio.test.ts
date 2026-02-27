import { describe, it, expect } from 'vitest'
import { formatearPrecio } from './formatear-precio'

describe('formatearPrecio', () => {
  it('formatea precio sin unidad', () => {
    const resultado = formatearPrecio(25)
    expect(resultado).toContain('25')
    expect(resultado).toContain('$')
  })

  it('formatea precio con unidad hora', () => {
    const resultado = formatearPrecio(10, 'hora')
    expect(resultado).toContain('10')
    expect(resultado).toContain('por hora')
  })

  it('formatea precio con unidad día', () => {
    const resultado = formatearPrecio(50, 'dia')
    expect(resultado).toContain('50')
    expect(resultado).toContain('por día')
  })

  it('formatea precio con unidad mes', () => {
    const resultado = formatearPrecio(200, 'mes')
    expect(resultado).toContain('200')
    expect(resultado).toContain('por mes')
  })

  it('formatea decimales correctamente', () => {
    const resultado = formatearPrecio(10.5)
    expect(resultado).toContain('10')
    expect(resultado).toContain('50')
  })

  it('formatea cero', () => {
    const resultado = formatearPrecio(0)
    expect(resultado).toContain('0')
  })
})

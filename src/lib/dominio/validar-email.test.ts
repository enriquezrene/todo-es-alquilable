import { describe, it, expect } from 'vitest'
import { validarEmail } from './validar-email'

describe('validarEmail', () => {
  it('acepta email válido', () => {
    expect(validarEmail('usuario@ejemplo.com')).toBe(true)
  })

  it('acepta email con subdominio', () => {
    expect(validarEmail('usuario@mail.ejemplo.com')).toBe(true)
  })

  it('rechaza email sin @', () => {
    expect(validarEmail('usuarioejemplo.com')).toBe(false)
  })

  it('rechaza email sin dominio', () => {
    expect(validarEmail('usuario@')).toBe(false)
  })

  it('rechaza email sin usuario', () => {
    expect(validarEmail('@ejemplo.com')).toBe(false)
  })

  it('rechaza string vacío', () => {
    expect(validarEmail('')).toBe(false)
  })

  it('rechaza email con espacios', () => {
    expect(validarEmail('usuario @ejemplo.com')).toBe(false)
  })
})

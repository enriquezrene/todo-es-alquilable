import { describe, it, expect } from 'vitest'
import { validarTelefonoEcuador, formatearTelefonoEcuador } from './validar-telefono-ecuador'

describe('validarTelefonoEcuador', () => {
  it('acepta formato +593 con 9 dígitos', () => {
    expect(validarTelefonoEcuador('+593991234567')).toBe(true)
  })

  it('rechaza sin prefijo +593', () => {
    expect(validarTelefonoEcuador('0991234567')).toBe(false)
  })

  it('rechaza con menos dígitos', () => {
    expect(validarTelefonoEcuador('+59399123456')).toBe(false)
  })

  it('rechaza con más dígitos', () => {
    expect(validarTelefonoEcuador('+5939912345678')).toBe(false)
  })

  it('rechaza string vacío', () => {
    expect(validarTelefonoEcuador('')).toBe(false)
  })

  it('rechaza con espacios', () => {
    expect(validarTelefonoEcuador('+593 99 1234567')).toBe(false)
  })
})

describe('formatearTelefonoEcuador', () => {
  it('formatea número con prefijo 593', () => {
    expect(formatearTelefonoEcuador('593991234567')).toBe('+593991234567')
  })

  it('formatea número con 0 inicial', () => {
    expect(formatearTelefonoEcuador('0991234567')).toBe('+593991234567')
  })

  it('formatea número de 9 dígitos', () => {
    expect(formatearTelefonoEcuador('991234567')).toBe('+593991234567')
  })

  it('retorna sin cambio si no reconoce formato', () => {
    expect(formatearTelefonoEcuador('12345')).toBe('12345')
  })
})

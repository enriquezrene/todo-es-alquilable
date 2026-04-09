import { describe, it, expect } from 'vitest'
import { validarTelefonoEcuador, formatearTelefonoEcuador } from './validar-telefono-ecuador'

describe('validarTelefonoEcuador', () => {
  it('acepta formato local con 0 inicial', () => {
    expect(validarTelefonoEcuador('0991234567')).toBe(true)
  })

  it('acepta formato legado con prefijo 593', () => {
    expect(validarTelefonoEcuador('+593991234567')).toBe(true)
  })

  it('rechaza con menos dígitos', () => {
    expect(validarTelefonoEcuador('099123456')).toBe(false)
  })

  it('rechaza con más dígitos', () => {
    expect(validarTelefonoEcuador('09912345678')).toBe(false)
  })

  it('rechaza string vacío', () => {
    expect(validarTelefonoEcuador('')).toBe(false)
  })

  it('rechaza formatos incompletos', () => {
    expect(validarTelefonoEcuador('991234567')).toBe(false)
  })
})

describe('formatearTelefonoEcuador', () => {
  it('convierte número con prefijo 593 al formato local', () => {
    expect(formatearTelefonoEcuador('593991234567')).toBe('0991234567')
  })

  it('mantiene número local con 0 inicial', () => {
    expect(formatearTelefonoEcuador('0991234567')).toBe('0991234567')
  })

  it('agrega 0 inicial a un número móvil de 9 dígitos', () => {
    expect(formatearTelefonoEcuador('991234567')).toBe('0991234567')
  })

  it('retorna sin cambio si no reconoce formato', () => {
    expect(formatearTelefonoEcuador('12345')).toBe('12345')
  })
})

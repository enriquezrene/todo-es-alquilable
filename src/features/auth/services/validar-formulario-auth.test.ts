import { describe, it, expect } from 'vitest'
import { validarFormularioRegistro, validarFormularioLogin } from './validar-formulario-auth'
import type { FormularioRegistro, FormularioLogin } from '../types'

const registroValido: FormularioRegistro = {
  email: 'test@ejemplo.com',
  password: '123456',
  confirmPassword: '123456',
  displayName: 'Juan Pérez',
  phone: '0991234567',
  province: 'Pichincha',
  city: 'Quito',
  address: 'Av. Test 123',
}

describe('validarFormularioRegistro', () => {
  it('no retorna errores con datos válidos', () => {
    const errores = validarFormularioRegistro(registroValido)
    expect(Object.keys(errores)).toHaveLength(0)
  })

  it('requiere email', () => {
    const errores = validarFormularioRegistro({ ...registroValido, email: '' })
    expect(errores.email).toBeTruthy()
  })

  it('valida formato de email', () => {
    const errores = validarFormularioRegistro({ ...registroValido, email: 'invalido' })
    expect(errores.email).toBeTruthy()
  })

  it('requiere contraseña de al menos 6 caracteres', () => {
    const errores = validarFormularioRegistro({ ...registroValido, password: '123' })
    expect(errores.password).toBeTruthy()
  })

  it('valida que las contraseñas coincidan', () => {
    const errores = validarFormularioRegistro({ ...registroValido, confirmPassword: 'diferente' })
    expect(errores.confirmPassword).toBeTruthy()
  })

  it('requiere nombre', () => {
    const errores = validarFormularioRegistro({ ...registroValido, displayName: '' })
    expect(errores.displayName).toBeTruthy()
  })

  it('requiere teléfono con formato Ecuador', () => {
    const errores = validarFormularioRegistro({ ...registroValido, phone: '12345' })
    expect(errores.phone).toBeTruthy()
  })

  it('requiere provincia', () => {
    const errores = validarFormularioRegistro({ ...registroValido, province: '' })
    expect(errores.province).toBeTruthy()
  })

  it('requiere ciudad', () => {
    const errores = validarFormularioRegistro({ ...registroValido, city: '' })
    expect(errores.city).toBeTruthy()
  })

  it('requiere dirección', () => {
    const errores = validarFormularioRegistro({ ...registroValido, address: '' })
    expect(errores.address).toBeTruthy()
  })
})

describe('validarFormularioLogin', () => {
  const loginValido: FormularioLogin = {
    email: 'test@ejemplo.com',
    password: '123456',
  }

  it('no retorna errores con datos válidos', () => {
    const errores = validarFormularioLogin(loginValido)
    expect(Object.keys(errores)).toHaveLength(0)
  })

  it('requiere email', () => {
    const errores = validarFormularioLogin({ ...loginValido, email: '' })
    expect(errores.email).toBeTruthy()
  })

  it('requiere contraseña', () => {
    const errores = validarFormularioLogin({ ...loginValido, password: '' })
    expect(errores.password).toBeTruthy()
  })
})

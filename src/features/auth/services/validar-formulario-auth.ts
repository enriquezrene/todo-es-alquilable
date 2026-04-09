import type { FormularioRegistro, FormularioLogin, ErroresFormulario } from '../types'
import { validarEmail } from '@/lib/dominio/validar-email'
import { validarTelefonoEcuador } from '@/lib/dominio/validar-telefono-ecuador'

export function validarFormularioRegistro(datos: FormularioRegistro): ErroresFormulario {
  const errores: ErroresFormulario = {}

  if (!datos.email.trim()) {
    errores.email = 'El email es requerido'
  } else if (!validarEmail(datos.email)) {
    errores.email = 'El email no es válido'
  }

  if (!datos.password) {
    errores.password = 'La contraseña es requerida'
  } else if (datos.password.length < 6) {
    errores.password = 'La contraseña debe tener al menos 6 caracteres'
  }

  if (!datos.confirmPassword) {
    errores.confirmPassword = 'Confirma tu contraseña'
  } else if (datos.password !== datos.confirmPassword) {
    errores.confirmPassword = 'Las contraseñas no coinciden'
  }

  if (!datos.displayName.trim()) {
    errores.displayName = 'El nombre es requerido'
  } else if (datos.displayName.trim().length < 2) {
    errores.displayName = 'El nombre debe tener al menos 2 caracteres'
  }

  if (!datos.phone.trim()) {
    errores.phone = 'El teléfono es requerido'
  } else if (!validarTelefonoEcuador(datos.phone)) {
    errores.phone = 'El teléfono debe tener formato 0999999999'
  }

  if (!datos.province) {
    errores.province = 'La provincia es requerida'
  }

  if (!datos.city) {
    errores.city = 'La ciudad es requerida'
  }

  if (!datos.address.trim()) {
    errores.address = 'La dirección es requerida'
  }

  return errores
}

export function validarFormularioLogin(datos: FormularioLogin): ErroresFormulario {
  const errores: ErroresFormulario = {}

  if (!datos.email.trim()) {
    errores.email = 'El email es requerido'
  } else if (!validarEmail(datos.email)) {
    errores.email = 'El email no es válido'
  }

  if (!datos.password) {
    errores.password = 'La contraseña es requerida'
  }

  return errores
}

import type { FormularioPerfil, ErroresFormulario } from '../types'
import { validarTelefonoEcuador } from '@/lib/dominio/validar-telefono-ecuador'

export function validarFormularioPerfil(datos: FormularioPerfil): ErroresFormulario {
  const errores: ErroresFormulario = {}

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

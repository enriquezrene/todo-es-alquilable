import { enviarEmailRecuperacionContrasena } from '@/lib/firebase/firebase-auth'
import { registrarError } from '@/lib/registrar-error'

export async function enviarEmailRecuperacion(email: string) {
  try {
    await enviarEmailRecuperacionContrasena(email)
  } catch (error) {
    registrarError(error, 'RecuperarContrasenaService:enviar-email-recuperacion')
    throw new Error('No se pudo enviar el email de recuperación. Por favor, inténtalo de nuevo más tarde.')
  }
}

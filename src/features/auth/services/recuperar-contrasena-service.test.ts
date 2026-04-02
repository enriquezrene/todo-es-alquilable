import { describe, it, expect, vi, beforeEach } from 'vitest'
import { enviarEmailRecuperacion } from './recuperar-contrasena-service'
import { enviarEmailRecuperacionContrasena } from '@/lib/firebase/firebase-auth'
import { registrarError } from '@/lib/registrar-error'

vi.mock('@/lib/firebase/firebase-auth')
vi.mock('@/lib/registrar-error')

describe('recuperar-contrasena-service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('enviarEmailRecuperacion', () => {
    it('debe enviar el email de recuperación exitosamente', async () => {
      vi.mocked(enviarEmailRecuperacionContrasena).mockResolvedValue(undefined)

      await expect(enviarEmailRecuperacion('test@example.com')).resolves.toBeUndefined()
      expect(enviarEmailRecuperacionContrasena).toHaveBeenCalledWith('test@example.com')
      expect(registrarError).not.toHaveBeenCalled()
    })

    it('debe manejar errores y lanzar error personalizado', async () => {
      const firebaseError = new Error('Firebase error')
      vi.mocked(enviarEmailRecuperacionContrasena).mockRejectedValue(firebaseError)

      await expect(enviarEmailRecuperacion('test@example.com')).rejects.toThrow(
        'No se pudo enviar el email de recuperación. Por favor, inténtalo de nuevo más tarde.'
      )
      expect(registrarError).toHaveBeenCalledWith(firebaseError, 'RecuperarContrasenaService:enviar-email-recuperacion')
    })
  })
})

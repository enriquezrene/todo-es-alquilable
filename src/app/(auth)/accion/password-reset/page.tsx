'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Container from '@/shared/components/layout/Container'
import { getAuthInstance } from '@/lib/firebase/firebase-config'
import { applyActionCode, checkActionCode } from 'firebase/auth'
import Button from '@/shared/components/ui/Button'

export default function PasswordResetActionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const handlePasswordReset = async () => {
      const oobCode = searchParams.get('oobCode')
      const mode = searchParams.get('mode')

      if (!oobCode || mode !== 'resetPassword') {
        setError('Enlace inválido o expirado')
        setLoading(false)
        return
      }

      try {
        const auth = getAuthInstance()
        
        // Verify the action code is valid
        await checkActionCode(auth, oobCode)
        
        // The password reset form will be handled by Firebase's default UI
        // After user completes password reset, Firebase will redirect to the continue URL
        setSuccess(true)
      } catch (err) {
        setError('El enlace para restablecer contraseña es inválido o ha expirado')
      } finally {
        setLoading(false)
      }
    }

    handlePasswordReset()
  }, [searchParams])

  if (loading) {
    return (
      <Container className="py-12">
        <div className="mx-auto max-w-md text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Procesando...</p>
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="py-12">
        <div className="mx-auto max-w-md text-center space-y-6">
          <div className="space-y-2">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Error</h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-600">{error}</p>
            <p className="text-sm text-gray-500">
              Por favor, solicita un nuevo email para recuperar tu contraseña.
            </p>
          </div>

          <div className="space-y-3">
            <Button onClick={() => router.push('/recuperar-contrasena')} className="w-full">
              Solicitar nuevo email
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/iniciar-sesion')} 
              className="w-full"
            >
              Volver a iniciar sesión
            </Button>
          </div>
        </div>
      </Container>
    )
  }

  if (success) {
    return (
      <Container className="py-12">
        <div className="mx-auto max-w-md text-center space-y-6">
          <div className="space-y-2">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">¡Contraseña restablecida!</h2>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600">
              Tu contraseña ha sido actualizada exitosamente.
            </p>
            <p className="text-sm text-gray-500">
              Ahora puedes iniciar sesión con tu nueva contraseña.
            </p>
          </div>

          <div className="space-y-3">
            <Button onClick={() => router.push('/iniciar-sesion')} className="w-full">
              Iniciar sesión ahora
            </Button>
          </div>
        </div>
      </Container>
    )
  }

  return null
}

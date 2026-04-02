'use client'

import Link from 'next/link'
import Button from '@/shared/components/ui/Button'

export default function RecuperarContrasenaCompletado() {
  return (
    <div className="text-center space-y-6">
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
        <Link href="/iniciar-sesion">
          <Button className="w-full">Iniciar sesión ahora</Button>
        </Link>
      </div>
    </div>
  )
}

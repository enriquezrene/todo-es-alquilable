'use client'

import Link from 'next/link'
import Button from '@/shared/components/ui/Button'

export default function RecuperarContrasenaExitoso() {
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
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Email enviado</h2>
      </div>

      <div className="space-y-4">
        <p className="text-gray-600">
          Hemos enviado un email con las instrucciones para recuperar tu contraseña.
        </p>
        <p className="text-sm text-gray-500">
          Revisa tu bandeja de entrada y carpeta de spam. Haz clic en el enlace del email para
          crear tu nueva contraseña. Después de restablecerla, serás redirigido automáticamente
          para que puedas iniciar sesión.
        </p>
      </div>

      <div className="space-y-3">
        <Link href="/iniciar-sesion">
          <Button className="w-full" variant="outline">
            Volver a iniciar sesión
          </Button>
        </Link>
        <Link href="/recuperar-contrasena" className="block">
          <button
            type="button"
            className="w-full text-sm text-blue-600 hover:text-blue-500 font-medium"
          >
            Reenviar email
          </button>
        </Link>
        <p className="text-xs text-gray-400 mt-4">
          ¿Ya restableciste tu contraseña?{' '}
          <Link href="/recuperar-contrasena/completado" className="text-blue-600 hover:text-blue-500">
            Ir a iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}

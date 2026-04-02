import type { Metadata } from 'next'
import Container from '@/shared/components/layout/Container'
import RecuperarContrasenaForm from '@/features/auth/components/RecuperarContrasenaForm'

export const metadata: Metadata = {
  title: 'Recuperar contraseña - Todo es Alquilable',
}

export default function RecuperarContrasenaPage() {
  return (
    <Container className="py-12">
      <div className="mx-auto max-w-md">
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">Recuperar contraseña</h1>
        <p className="mb-8 text-center text-gray-600">
          Ingresa tu email y te enviaremos las instrucciones para recuperar tu contraseña
        </p>
        <RecuperarContrasenaForm />
      </div>
    </Container>
  )
}

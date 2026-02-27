import type { Metadata } from 'next'
import Container from '@/shared/components/layout/Container'
import LoginForm from '@/features/auth/components/LoginForm'

export const metadata: Metadata = {
  title: 'Iniciar sesión - Todo es Alquilable',
}

export default function IniciarSesionPage() {
  return (
    <Container className="py-12">
      <div className="mx-auto max-w-md">
        <h1 className="mb-8 text-center text-2xl font-bold text-gray-900">Iniciar sesión</h1>
        <LoginForm />
      </div>
    </Container>
  )
}

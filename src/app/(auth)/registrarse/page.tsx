import type { Metadata } from 'next'
import Container from '@/shared/components/layout/Container'
import RegisterForm from '@/features/auth/components/RegisterForm'

export const metadata: Metadata = {
  title: 'Registrarse - Todo es Alquilable',
}

export default function RegistrarsePage() {
  return (
    <Container className="py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-center text-2xl font-bold text-gray-900">Crear cuenta</h1>
        <RegisterForm />
      </div>
    </Container>
  )
}

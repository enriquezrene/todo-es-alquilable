import type { Metadata } from 'next'
import Container from '@/shared/components/layout/Container'
import RecuperarContrasenaExitoso from '@/features/auth/components/RecuperarContrasenaExitoso'

export const metadata: Metadata = {
  title: 'Email enviado - Todo es Alquilable',
}

export default function RecuperarContrasenaExitoPage() {
  return (
    <Container className="py-12">
      <div className="mx-auto max-w-md">
        <RecuperarContrasenaExitoso />
      </div>
    </Container>
  )
}

import type { Metadata } from 'next'
import Container from '@/shared/components/layout/Container'
import RecuperarContrasenaCompletado from '@/features/auth/components/RecuperarContrasenaCompletado'

export const metadata: Metadata = {
  title: 'Contraseña restablecida - Todo es Alquilable',
}

export default function RecuperarContrasenaCompletadoPage() {
  return (
    <Container className="py-12">
      <div className="mx-auto max-w-md">
        <RecuperarContrasenaCompletado />
      </div>
    </Container>
  )
}

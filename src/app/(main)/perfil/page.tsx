import type { Metadata } from 'next'
import Container from '@/shared/components/layout/Container'
import AuthGuard from '@/features/auth/components/AuthGuard'
import ProfileForm from '@/features/profile/components/ProfileForm'

export const metadata: Metadata = {
  title: 'Mi perfil - Todo es Alquilable',
}

export default function PerfilPage() {
  return (
    <AuthGuard>
      <Container className="py-8">
        <div className="mx-auto max-w-lg">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">Mi perfil</h1>
          <ProfileForm />
        </div>
      </Container>
    </AuthGuard>
  )
}

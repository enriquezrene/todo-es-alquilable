import type { Metadata } from 'next'
import Container from '@/shared/components/layout/Container'
import AuthGuard from '@/features/auth/components/AuthGuard'
import ListingFormStepper from '@/features/listings/components/ListingFormStepper'

export const metadata: Metadata = {
  title: 'Publicar anuncio - Todo es Alquilable',
}

export default function PublicarPage() {
  return (
    <AuthGuard>
      <Container className="py-8">
        <h1 className="mb-8 text-center text-2xl font-bold text-gray-900">Publicar anuncio</h1>
        <ListingFormStepper />
      </Container>
    </AuthGuard>
  )
}

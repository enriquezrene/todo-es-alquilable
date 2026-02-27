import Link from 'next/link'
import Container from '@/shared/components/layout/Container'
import Button from '@/shared/components/ui/Button'

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center justify-center py-24">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <h2 className="mt-4 text-xl font-semibold text-gray-900">Página no encontrada</h2>
      <p className="mt-2 text-gray-500">La página que buscas no existe o fue movida.</p>
      <Link href="/" className="mt-6">
        <Button>Volver al inicio</Button>
      </Link>
    </Container>
  )
}

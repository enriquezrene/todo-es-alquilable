'use client'

import Container from '@/shared/components/layout/Container'
import Button from '@/shared/components/ui/Button'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <Container className="flex flex-col items-center justify-center py-24">
      <h1 className="text-4xl font-bold text-gray-300">Error</h1>
      <h2 className="mt-4 text-xl font-semibold text-gray-900">Algo salió mal</h2>
      <p className="mt-2 text-gray-500">Ocurrió un error inesperado. Por favor intenta de nuevo.</p>
      <Button onClick={reset} className="mt-6">
        Intentar de nuevo
      </Button>
    </Container>
  )
}

'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#d1d5db' }}>Error</h1>
          <h2 style={{ marginTop: '1rem', fontSize: '1.25rem', fontWeight: 600, color: '#111827' }}>Algo salió mal</h2>
          <p style={{ marginTop: '0.5rem', color: '#6b7280' }}>Ocurrió un error inesperado. Por favor intenta de nuevo.</p>
          <button
            onClick={reset}
            style={{ marginTop: '1.5rem', padding: '0.5rem 1.5rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1rem' }}
          >
            Intentar de nuevo
          </button>
        </div>
      </body>
    </html>
  )
}

import * as Sentry from '@sentry/nextjs'

export function registrarError(error: unknown, context?: string): void {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`[${context ?? 'Error'}]`, message, error)
  Sentry.captureException(error, { tags: { context } })
}

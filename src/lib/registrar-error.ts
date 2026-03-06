export function registrarError(error: unknown, context?: string): void {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`[${context ?? 'Error'}]`, message, error)

  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    import('@sentry/nextjs').then((Sentry) => {
      Sentry.captureException(error, { tags: { context } })
    })
  }
}

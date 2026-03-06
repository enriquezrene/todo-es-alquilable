/** @type {import('next').NextConfig} */
const nextConfig = {}

const hasSentry = !!process.env.SENTRY_ORG && !!process.env.SENTRY_PROJECT

let config = nextConfig
if (hasSentry) {
  const { withSentryConfig } = await import('@sentry/nextjs')
  config = withSentryConfig(nextConfig, {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    silent: !process.env.CI,
    widenClientFileUpload: true,
    webpack: { treeshake: { removeDebugLogging: true } },
    hideSourceMaps: true,
  })
}

export default config

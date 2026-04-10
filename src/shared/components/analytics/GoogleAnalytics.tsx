'use client'

import Script from 'next/script'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

type Props = {
  measurementId: string
}

export default function GoogleAnalytics({ measurementId }: Props) {
  const pathname = usePathname()

  useEffect(() => {
    if (!measurementId || typeof window.gtag !== 'function') return

    const query = window.location.search
    const pagePath = query ? `${pathname}${query}` : pathname

    window.gtag('config', measurementId, {
      page_path: pagePath,
    })
  }, [measurementId, pathname])

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            send_page_view: false
          });
        `}
      </Script>
    </>
  )
}

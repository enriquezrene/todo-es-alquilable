import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/shared/providers/AuthProvider'
import { ToastProvider } from '@/shared/providers/ToastProvider'
import Navbar from '@/shared/components/layout/Navbar'
import Footer from '@/shared/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Todo es Alquilable - Alquila lo que necesites',
  description:
    'Marketplace de alquiler en Ecuador. Alquila herramientas, electrónica, deportes, vehículos y más.',
  keywords: ['alquiler', 'renta', 'Ecuador', 'marketplace', 'herramientas', 'equipos'],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

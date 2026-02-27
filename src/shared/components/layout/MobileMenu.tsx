'use client'

import Link from 'next/link'
import { useAuth } from '@/shared/providers/AuthProvider'
import { cerrarSesion } from '@/lib/firebase/firebase-auth'
import Button from '@/shared/components/ui/Button'

type MobileMenuProps = {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { user, role } = useAuth()
  const isAdmin = role === 'admin' || role === 'super_admin' || role === 'moderator'

  const handleSignOut = async () => {
    await cerrarSesion()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-72 bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-lg font-semibold">Menú</span>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:text-gray-600" aria-label="Cerrar menú">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-3">
          <Link href="/buscar" onClick={onClose} className="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">
            Buscar
          </Link>

          {user ? (
            <>
              <Link href="/publicar" onClick={onClose} className="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">
                Publicar anuncio
              </Link>
              <Link href="/mis-anuncios" onClick={onClose} className="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">
                Mis anuncios
              </Link>
              <Link href="/perfil" onClick={onClose} className="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">
                Mi perfil
              </Link>
              {isAdmin && (
                <Link href="/admin/pendientes" onClick={onClose} className="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">
                  Panel Admin
                </Link>
              )}
              <Button variant="outline" onClick={handleSignOut} className="mt-2">
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Link href="/iniciar-sesion" onClick={onClose}>
                <Button variant="outline" className="w-full">
                  Iniciar sesión
                </Button>
              </Link>
              <Link href="/registrarse" onClick={onClose}>
                <Button className="w-full">Registrarse</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </div>
  )
}

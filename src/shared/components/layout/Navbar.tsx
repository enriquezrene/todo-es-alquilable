'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/shared/providers/AuthProvider'
import { cerrarSesion } from '@/lib/firebase/firebase-auth'
import Container from './Container'
import Button from '@/shared/components/ui/Button'
import MobileMenu from './MobileMenu'

export default function Navbar() {
  const { user, role, loading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const handleSignOut = async () => {
    await cerrarSesion()
  }

  const isAdmin = role === 'admin' || role === 'super_admin' || role === 'moderator'

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Todo es Alquilable
          </Link>

          <div className="hidden items-center gap-4 md:flex">
            <Link 
              href="/buscar" 
              className={`text-sm font-medium transition-colors ${
                pathname === '/buscar' 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Buscar
            </Link>

            {!loading && (
              <>
                {user ? (
                  <>
                    <Link href="/publicar"
                          className={`text-sm font-medium transition-colors ${
                            pathname === '/publicar'
                              ? 'text-blue-600'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                    >
                      Publicar
                    </Link>
                    <Link 
                      href="/mis-anuncios" 
                      className={`text-sm font-medium transition-colors ${
                        pathname === '/mis-anuncios' 
                          ? 'text-blue-600' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Mis anuncios
                    </Link>
                    {isAdmin && (
                      <Link 
                        href="/admin/pendientes" 
                        className={`text-sm font-medium transition-colors ${
                          pathname.startsWith('/admin') 
                            ? 'text-blue-600' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Gestionar anuncios
                      </Link>
                    )}
                    <Link 
                      href="/perfil" 
                      className={`text-sm font-medium transition-colors ${
                        pathname === '/perfil' 
                          ? 'text-blue-600' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {'Mi Perfil'}
                    </Link>
                    <Button variant="ghost" size="sm" onClick={handleSignOut}>
                      Salir
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/iniciar-sesion">
                      <Button variant="outline" size="sm">
                        Iniciar sesión
                      </Button>
                    </Link>
                    <Link href="/registrarse">
                      <Button size="sm">Registrarse</Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          <button
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Abrir menú"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </Container>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </nav>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Container from '@/shared/components/layout/Container'
import SearchBar from '@/features/search/components/SearchBar'
import ListingGrid from '@/features/listings/components/ListingGrid'
import Button from '@/shared/components/ui/Button'
import { obtenerAnunciosAprobados } from '@/features/listings/services/listing-service'
import { obtenerCategorias } from '@/features/admin/services/category-admin-service'
import { categoriasIniciales } from '@/lib/dominio/categorias-iniciales'
import { obtenerNombresProvincias } from '@/lib/dominio/provincias-ecuador'
import { registrarError } from '@/lib/registrar-error'
import type { Anuncio } from '@/shared/types/anuncio'
import type { Categoria } from '@/shared/types/categoria'

export default function HomePage() {
  const router = useRouter()
  const [recientes, setRecientes] = useState<Anuncio[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function cargar() {
      try {
        const [{ anuncios }, categoriasData] = await Promise.all([
          obtenerAnunciosAprobados(8),
          obtenerCategorias()
        ])
        setRecientes(anuncios)
        setCategorias(categoriasData)
      } catch (e) {
        registrarError(e, 'HomePage:cargar')
        setRecientes([])
        setCategorias([])
      }
      setLoading(false)
    }
    cargar()
  }, [])

  const handleSearch = (q: string) => {
    router.push(`/buscar?q=${encodeURIComponent(q)}`)
  }

  const provincias = obtenerNombresProvincias().slice(0, 8)

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-16 text-white sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold sm:text-5xl">
              Alquila lo que necesites, cuando lo necesites
            </h1>
            <p className="mt-4 text-lg text-blue-100">
              El marketplace de alquiler de Ecuador. Encuentra herramientas, equipos, vehículos y más.
            </p>
            <SearchBar onSearch={handleSearch} className="mt-8" />
          </div>
        </Container>
      </section>

      {/* Categories */}
      <section className="py-12">
        <Container>
          <h2 className="mb-6 text-xl font-bold text-gray-900">Categorías populares</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {categorias.length > 0 ? (
              categorias.slice(0, 12).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/buscar?categoria=${cat.id}`}
                  className="flex flex-col items-center rounded-xl border border-gray-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50"
                >
                  <span className="text-3xl">{cat.icon}</span>
                  <span className="mt-2 text-center text-sm font-medium text-gray-700">{cat.name}</span>
                </Link>
              ))
            ) : (
              // Fallback to placeholder categories if no real ones exist
              categoriasIniciales.map((cat, i) => (
                <Link
                  key={i}
                  href={`/buscar?categoria=seed-${i}`}
                  className="flex flex-col items-center rounded-xl border border-gray-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50"
                >
                  <span className="text-3xl">{cat.icono}</span>
                  <span className="mt-2 text-center text-sm font-medium text-gray-700">{cat.nombre}</span>
                </Link>
              ))
            )}
          </div>
        </Container>
      </section>

      {/* Recent listings */}
      <section className="bg-gray-50 py-12">
        <Container>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Anuncios recientes</h2>
            <Link href="/buscar">
              <Button variant="outline" size="sm">
                Ver todos
              </Button>
            </Link>
          </div>
          <ListingGrid anuncios={recientes} loading={loading} emptyMessage="Aún no hay anuncios publicados" />
        </Container>
      </section>

      {/* Province quick filter */}
      <section className="py-12">
        <Container>
          <h2 className="mb-6 text-xl font-bold text-gray-900">Busca por provincia</h2>
          <div className="flex flex-wrap gap-2">
            {provincias.map((provincia) => (
              <Link
                key={provincia}
                href={`/buscar?provincia=${encodeURIComponent(provincia)}`}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
              >
                {provincia}
              </Link>
            ))}
            <Link
              href="/buscar"
              className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
            >
              Ver todas &rarr;
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}

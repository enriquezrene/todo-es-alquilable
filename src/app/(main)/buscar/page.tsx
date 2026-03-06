'use client'

import { Suspense, useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Container from '@/shared/components/layout/Container'
import SearchBar from '@/features/search/components/SearchBar'
import FilterPanel from '@/features/search/components/FilterPanel'
import ListingGrid from '@/features/listings/components/ListingGrid'
import Button from '@/shared/components/ui/Button'
import Spinner from '@/shared/components/ui/Spinner'
import { buscarAnuncios } from '@/features/search/services/search-service'
import { parseSearchParams } from '@/features/search/types'
import type { Anuncio } from '@/shared/types/anuncio'
import { registrarError } from '@/lib/registrar-error'
import type { DocumentSnapshot } from '@/lib/firebase/firebase-firestore'

function BuscarContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [anuncios, setAnuncios] = useState<Anuncio[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null)

  const params = Object.fromEntries(searchParams.entries())
  const filters = parseSearchParams(params)

  const updateParam = useCallback(
    (updates: Record<string, string>) => {
      const current = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          current.set(key, value)
        } else {
          current.delete(key)
        }
      })
      current.delete('pagina')
      router.push(`/buscar?${current.toString()}`)
    },
    [searchParams, router],
  )

  useEffect(() => {
    async function cargar() {
      setLoading(true)
      try {
        const result = await buscarAnuncios(filters)
        setAnuncios(result.anuncios)
        setLastDoc(result.lastDoc)
        setHasMore(result.hasMore)
      } catch (e) {
        registrarError(e, 'BuscarPage:buscar')
        setAnuncios([])
      }
      setLoading(false)
    }
    cargar()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const cargarMas = async () => {
    if (!lastDoc) return
    try {
      const result = await buscarAnuncios(filters, lastDoc)
      setAnuncios((prev) => [...prev, ...result.anuncios])
      setLastDoc(result.lastDoc)
      setHasMore(result.hasMore)
    } catch (e) {
      registrarError(e, 'BuscarPage:cargar-mas')
    }
  }

  return (
    <Container className="py-8">
      <SearchBar
        initialValue={filters.query}
        onSearch={(q) => updateParam({ q })}
        className="mb-6"
      />

      <div className="grid gap-6 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <FilterPanel
            categoryId={params.categoria || ''}
            province={params.provincia || ''}
            priceMin={params.precioMin || ''}
            priceMax={params.precioMax || ''}
            sortBy={params.orden || 'reciente'}
            onFilterChange={updateParam}
          />
        </aside>

        <div className="lg:col-span-3">
          <ListingGrid anuncios={anuncios} loading={loading} emptyMessage="No se encontraron resultados" />

          {hasMore && !loading && (
            <div className="mt-6 text-center">
              <Button variant="outline" onClick={cargarMas}>
                Cargar más
              </Button>
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}

export default function BuscarPage() {
  return (
    <Suspense fallback={<Container className="py-12"><Spinner size="lg" /></Container>}>
      <BuscarContent />
    </Suspense>
  )
}

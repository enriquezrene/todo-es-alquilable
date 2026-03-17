import type { Anuncio } from '@/shared/types/anuncio'
import EditableListingCard from './EditableListingCard'
import { SkeletonCard } from '@/shared/components/ui/Skeleton'
import EmptyState from '@/shared/components/feedback/EmptyState'

type EditableListingGridProps = {
  anuncios: Anuncio[]
  loading?: boolean
  emptyMessage?: string
}

export default function EditableListingGrid({
  anuncios,
  loading = false,
  emptyMessage = 'No se encontraron anuncios',
}: EditableListingGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (anuncios.length === 0) {
    return <EmptyState title={emptyMessage} description="Intenta con otros filtros o vuelve más tarde." />
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {anuncios.map((anuncio) => (
        <EditableListingCard key={anuncio.id} anuncio={anuncio} />
      ))}
    </div>
  )
}

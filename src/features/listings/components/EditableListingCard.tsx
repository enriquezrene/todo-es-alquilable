import Link from 'next/link'
import { formatearPrecio } from '@/lib/dominio/formatear-precio'
import type { Anuncio } from '@/shared/types/anuncio'
import Badge from '@/shared/components/ui/Badge'
import Button from '@/shared/components/ui/Button'

type EditableListingCardProps = {
  anuncio: Anuncio
}

export default function EditableListingCard({ anuncio }: EditableListingCardProps) {
  const imageSrc = anuncio.thumbnails[0] || anuncio.images[0] || '/placeholder.svg'

  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/anuncio/${anuncio.id}`}>
        <div className="aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={imageSrc}
            alt={anuncio.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/anuncio/${anuncio.id}`}>
          <h3 className="line-clamp-2 text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
            {anuncio.title}
          </h3>
        </Link>
        
        <p className="mt-1 text-lg font-bold text-blue-600">
          {formatearPrecio(anuncio.price, anuncio.priceUnit)}
        </p>
        
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-gray-500">{anuncio.province}</span>
          <Badge>{anuncio.categoryName}</Badge>
        </div>

        <div className="mt-3 flex gap-2">
          <Link href={`/mis-anuncios/editar/${anuncio.id}`} className="flex-1">
            <Button size="sm" variant="outline" className="w-full">
              Editar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

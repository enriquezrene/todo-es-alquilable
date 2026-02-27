import Link from 'next/link'
import { formatearPrecio } from '@/lib/dominio/formatear-precio'
import type { Anuncio } from '@/shared/types/anuncio'
import Badge from '@/shared/components/ui/Badge'

type ListingCardProps = {
  anuncio: Anuncio
}

export default function ListingCard({ anuncio }: ListingCardProps) {
  const imageSrc = anuncio.thumbnails[0] || anuncio.images[0] || '/placeholder.svg'

  return (
    <Link href={`/anuncio/${anuncio.id}`}>
      <article className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        <div className="aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={imageSrc}
            alt={anuncio.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="p-4">
          <h3 className="line-clamp-2 text-sm font-medium text-gray-900">{anuncio.title}</h3>
          <p className="mt-1 text-lg font-bold text-blue-600">
            {formatearPrecio(anuncio.price, anuncio.priceUnit)}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-gray-500">{anuncio.province}</span>
            <Badge>{anuncio.categoryName}</Badge>
          </div>
        </div>
      </article>
    </Link>
  )
}

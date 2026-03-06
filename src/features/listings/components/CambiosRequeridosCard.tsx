import Link from 'next/link'
import { formatearPrecio } from '@/lib/dominio/formatear-precio'
import type { Anuncio } from '@/shared/types/anuncio'

type Props = {
  anuncio: Anuncio
}

export default function CambiosRequeridosCard({ anuncio }: Props) {
  const imageSrc = anuncio.thumbnails[0] || anuncio.images[0] || '/placeholder.svg'

  return (
    <article className="overflow-hidden rounded-xl border border-orange-200 bg-white shadow-sm">
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={imageSrc}
          alt={anuncio.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 text-sm font-medium text-gray-900">{anuncio.title}</h3>
        <p className="mt-1 text-lg font-bold text-blue-600">
          {formatearPrecio(anuncio.price, anuncio.priceUnit)}
        </p>
        {anuncio.rejectionReason && (
          <div className="mt-2 rounded-lg bg-orange-50 p-3">
            <p className="text-xs font-medium text-orange-800">Cambios solicitados:</p>
            <p className="mt-1 text-xs text-orange-700">{anuncio.rejectionReason}</p>
          </div>
        )}
        <Link
          href={`/mis-anuncios/editar/${anuncio.id}`}
          className="mt-3 block w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Editar y reenviar
        </Link>
      </div>
    </article>
  )
}

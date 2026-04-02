'use client'

/* eslint-disable @next/next/no-img-element */
import { formatearPrecio } from '@/lib/dominio/formatear-precio'
import { etiquetasCondicion, type CondicionArticulo } from '@/lib/dominio/condiciones-articulo'
import type { UnidadPrecio } from '@/lib/dominio/unidades-precio'
import type { FormularioAnuncio, ImagenSlot, PasoFormulario } from '../types'

type Props = {
  datos: FormularioAnuncio
  onEditStep: (paso: PasoFormulario) => void
}

function EditLink({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="text-sm text-blue-600 hover:text-blue-500">
      {children}
    </button>
  )
}

export default function StepRevision({ datos, onEditStep }: Props) {
  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold">Revisa tu anuncio</h2>

      <div className="space-y-6">
        <section>
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Categoría</h3>
            <EditLink onClick={() => onEditStep('categoria')}>Editar</EditLink>
          </div>
          <p className="mt-1 text-gray-600">
            {datos.categoryName || datos.suggestedCategory || 'Sin categoría'}
          </p>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Fotos</h3>
            <EditLink onClick={() => onEditStep('fotos')}>Editar</EditLink>
          </div>
          <div className="mt-2 flex gap-2 overflow-x-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {datos.imageSlots.map((slot: ImagenSlot, i: number) => (
              <img
                key={i}
                src={slot.tipo === 'nueva' ? slot.preview : slot.thumbnail || slot.url}
                alt={`Foto ${i + 1}`}
                className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
              />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Detalles</h3>
            <EditLink onClick={() => onEditStep('detalles')}>Editar</EditLink>
          </div>
          <div className="mt-1 space-y-1 text-gray-600">
            <p><strong>Título:</strong> {datos.title}</p>
            <p><strong>Descripción:</strong> {datos.description}</p>
            <p><strong>Condición:</strong> {datos.condition ? etiquetasCondicion[datos.condition as CondicionArticulo] : ''}</p>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Precio y ubicación</h3>
            <EditLink onClick={() => onEditStep('precio')}>Editar</EditLink>
          </div>
          <div className="mt-1 space-y-1 text-gray-600">
            <p>
              <strong>Precio:</strong>{' '}
              {datos.price && datos.priceUnit
                ? formatearPrecio(parseFloat(datos.price), datos.priceUnit as UnidadPrecio)
                : ''}
            </p>
            <p><strong>Provincia:</strong> {datos.province}</p>
          </div>
        </section>
      </div>

      <div className="mt-6 rounded-lg bg-yellow-50 p-4">
        <p className="text-sm text-yellow-800">
          Tu anuncio será revisado por un moderador antes de publicarse. Esto suele tomar menos de 24 horas.
        </p>
      </div>
    </div>
  )
}

'use client'

import { useCallback } from 'react'
import type { FormularioAnuncio, ImagenSlot } from '../types'
import type { ErroresFormulario } from '@/features/auth/types'

type Props = {
  datos: FormularioAnuncio
  errores: ErroresFormulario
  onChange: (updates: Partial<FormularioAnuncio>) => void
}

export default function StepFotos({ datos, errores, onChange }: Props) {
  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return

      const nuevas = Array.from(files).filter((f) => f.type.startsWith('image/'))
      const total = datos.imageSlots.length + nuevas.length

      if (total > 3) {
        return
      }

      const nuevosSlots: ImagenSlot[] = nuevas.map((f) => ({
        tipo: 'nueva',
        file: f,
        preview: URL.createObjectURL(f),
      }))
      onChange({
        imageSlots: [...datos.imageSlots, ...nuevosSlots],
      })
    },
    [datos.imageSlots, onChange],
  )

  const eliminar = (index: number) => {
    const slot = datos.imageSlots[index]
    if (slot.tipo === 'nueva') {
      URL.revokeObjectURL(slot.preview)
    }
    onChange({
      imageSlots: datos.imageSlots.filter((_, i) => i !== index),
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  const getPreviewUrl = (slot: ImagenSlot): string =>
    slot.tipo === 'nueva' ? slot.preview : slot.thumbnail || slot.url

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Agrega fotos de tu artículo</h2>
      <p className="mb-4 text-sm text-gray-500">
        Mínimo 1, máximo 3 fotos. Cada una menor a 5MB.
      </p>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="flex min-h-[150px] cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-blue-400"
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            Arrastra fotos aquí o haz clic para seleccionar
          </p>
        </div>
      </div>

      <input
        id="file-input"
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {datos.imageSlots.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {datos.imageSlots.map((slot, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-lg">
              <img src={getPreviewUrl(slot)} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
              <button
                onClick={() => eliminar(i)}
                className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label={`Eliminar foto ${i + 1}`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 rounded bg-blue-600 px-2 py-0.5 text-xs text-white">
                  Principal
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {errores.images && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {errores.images}
        </p>
      )}
    </div>
  )
}

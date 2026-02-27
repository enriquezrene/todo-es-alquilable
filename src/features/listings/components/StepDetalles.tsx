'use client'

import { CONDICIONES_ARTICULO, etiquetasCondicion, type CondicionArticulo } from '@/lib/dominio/condiciones-articulo'
import type { FormularioAnuncio } from '../types'
import type { ErroresFormulario } from '@/features/auth/types'
import Input from '@/shared/components/ui/Input'
import Select from '@/shared/components/ui/Select'

type Props = {
  datos: FormularioAnuncio
  errores: ErroresFormulario
  onChange: (updates: Partial<FormularioAnuncio>) => void
}

const opcionesCondicion = Object.values(CONDICIONES_ARTICULO).map((value) => ({
  value,
  label: etiquetasCondicion[value as CondicionArticulo],
}))

export default function StepDetalles({ datos, errores, onChange }: Props) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Describe tu artículo</h2>

      <div className="space-y-4">
        <Input
          label="Título"
          value={datos.title}
          onChange={(e) => onChange({ title: e.target.value })}
          error={errores.title}
          placeholder="Ej: Taladro eléctrico Bosch profesional"
        />
        <p className="text-xs text-gray-500">{datos.title.length}/100 caracteres</p>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            id="description"
            value={datos.description}
            onChange={(e) => onChange({ description: e.target.value })}
            className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
              errores.description
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
            rows={4}
            placeholder="Describe el artículo, su estado, qué incluye, instrucciones de uso..."
          />
          <div className="mt-1 flex justify-between">
            {errores.description && (
              <p className="text-sm text-red-600" role="alert">
                {errores.description}
              </p>
            )}
            <p className="ml-auto text-xs text-gray-500">{datos.description.length}/1000</p>
          </div>
        </div>

        <Select
          label="Condición del artículo"
          options={opcionesCondicion}
          value={datos.condition}
          onChange={(e) => onChange({ condition: e.target.value as CondicionArticulo })}
          error={errores.condition}
          placeholder="Selecciona la condición"
        />
      </div>
    </div>
  )
}

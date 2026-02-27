'use client'

import { useMemo } from 'react'
import { UNIDADES_PRECIO, etiquetasUnidad, type UnidadPrecio } from '@/lib/dominio/unidades-precio'
import { obtenerNombresProvincias } from '@/lib/dominio/provincias-ecuador'
import type { FormularioAnuncio } from '../types'
import type { ErroresFormulario } from '@/features/auth/types'
import Input from '@/shared/components/ui/Input'
import Select from '@/shared/components/ui/Select'

type Props = {
  datos: FormularioAnuncio
  errores: ErroresFormulario
  onChange: (updates: Partial<FormularioAnuncio>) => void
}

const opcionesUnidad = Object.values(UNIDADES_PRECIO).map((value) => ({
  value,
  label: etiquetasUnidad[value as UnidadPrecio],
}))

export default function StepPrecio({ datos, errores, onChange }: Props) {
  const provincias = useMemo(
    () => obtenerNombresProvincias().map((p) => ({ value: p, label: p })),
    [],
  )

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Precio y ubicación</h2>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Precio (USD)"
            type="number"
            min="0"
            step="0.01"
            value={datos.price}
            onChange={(e) => onChange({ price: e.target.value })}
            error={errores.price}
            placeholder="0.00"
          />
          <Select
            label="Unidad de tiempo"
            options={opcionesUnidad}
            value={datos.priceUnit}
            onChange={(e) => onChange({ priceUnit: e.target.value as UnidadPrecio })}
            error={errores.priceUnit}
            placeholder="Selecciona unidad"
          />
        </div>

        <Select
          label="Provincia"
          options={provincias}
          value={datos.province}
          onChange={(e) => onChange({ province: e.target.value })}
          error={errores.province}
          placeholder="¿Dónde se encuentra el artículo?"
        />
      </div>
    </div>
  )
}

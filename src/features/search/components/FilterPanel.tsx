'use client'

import { useEffect, useState, useMemo } from 'react'
import { getDocs, collection, query, where, getDb } from '@/lib/firebase/firebase-firestore'
import { categoriasIniciales } from '@/lib/dominio/categorias-iniciales'
import { obtenerNombresProvincias } from '@/lib/dominio/provincias-ecuador'
import { registrarError } from '@/lib/registrar-error'
import Select from '@/shared/components/ui/Select'
import Input from '@/shared/components/ui/Input'
import Button from '@/shared/components/ui/Button'

type FilterPanelProps = {
  categoryId: string
  province: string
  priceMin: string
  priceMax: string
  sortBy: string
  onFilterChange: (filters: Record<string, string>) => void
}

export default function FilterPanel({
  categoryId,
  province,
  priceMin,
  priceMax,
  sortBy,
  onFilterChange,
}: FilterPanelProps) {
  const [categorias, setCategorias] = useState<{ value: string; label: string }[]>([])

  const provincias = useMemo(
    () => [{ value: '', label: 'Todas' }, ...obtenerNombresProvincias().map((p) => ({ value: p, label: p }))],
    [],
  )

  const ordenOpciones = [
    { value: 'reciente', label: 'Más recientes' },
    { value: 'precio_asc', label: 'Precio: menor a mayor' },
    { value: 'precio_desc', label: 'Precio: mayor a menor' },
  ]

  useEffect(() => {
    async function cargar() {
      try {
        const q = query(collection(getDb(), 'categories'), where('isActive', '==', true))
        const snapshot = await getDocs(q)
        const cats = snapshot.empty
          ? categoriasIniciales.map((c, i) => ({ value: `seed-${i}`, label: c.nombre }))
          : snapshot.docs.map((doc) => ({ value: doc.id, label: doc.data().name }))
        setCategorias([{ value: '', label: 'Todas' }, ...cats])
      } catch (e) {
        registrarError(e, 'FilterPanel:cargar-categorias')
        setCategorias([
          { value: '', label: 'Todas' },
          ...categoriasIniciales.map((c, i) => ({ value: `seed-${i}`, label: c.nombre })),
        ])
      }
    }
    cargar()
  }, [])

  const handleClear = () => {
    onFilterChange({ categoria: '', provincia: '', precioMin: '', precioMax: '', orden: 'reciente' })
  }

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4">
      <h3 className="font-medium text-gray-900">Filtros</h3>

      <Select
        label="Categoría"
        options={categorias}
        value={categoryId}
        onChange={(e) => onFilterChange({ categoria: e.target.value })}
      />

      <Select
        label="Provincia"
        options={provincias}
        value={province}
        onChange={(e) => onFilterChange({ provincia: e.target.value })}
      />

      <div className="grid grid-cols-2 gap-2">
        <Input
          label="Precio mín."
          type="number"
          min="0"
          value={priceMin}
          onChange={(e) => onFilterChange({ precioMin: e.target.value })}
          placeholder="$0"
        />
        <Input
          label="Precio máx."
          type="number"
          min="0"
          value={priceMax}
          onChange={(e) => onFilterChange({ precioMax: e.target.value })}
          placeholder="$999"
        />
      </div>

      <Select
        label="Ordenar por"
        options={ordenOpciones}
        value={sortBy}
        onChange={(e) => onFilterChange({ orden: e.target.value })}
      />

      <Button variant="ghost" onClick={handleClear} className="w-full">
        Limpiar filtros
      </Button>
    </div>
  )
}

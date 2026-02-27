'use client'

import { useEffect, useState } from 'react'
import { getDocs, collection, query, where, db } from '@/lib/firebase/firebase-firestore'
import { categoriasIniciales } from '@/lib/dominio/categorias-iniciales'
import type { FormularioAnuncio } from '../types'
import type { ErroresFormulario } from '@/features/auth/types'
import Input from '@/shared/components/ui/Input'

type Props = {
  datos: FormularioAnuncio
  errores: ErroresFormulario
  onChange: (updates: Partial<FormularioAnuncio>) => void
}

type CategoriaOption = { id: string; name: string; icon: string }

export default function StepCategoria({ datos, errores, onChange }: Props) {
  const [categorias, setCategorias] = useState<CategoriaOption[]>([])
  const [showSuggestion, setShowSuggestion] = useState(false)

  useEffect(() => {
    async function cargar() {
      try {
        const q = query(collection(db, 'categories'), where('isActive', '==', true))
        const snapshot = await getDocs(q)
        if (snapshot.empty) {
          setCategorias(categoriasIniciales.map((c, i) => ({ id: `seed-${i}`, name: c.nombre, icon: c.icono })))
        } else {
          setCategorias(snapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name, icon: doc.data().icon })))
        }
      } catch {
        setCategorias(categoriasIniciales.map((c, i) => ({ id: `seed-${i}`, name: c.nombre, icon: c.icono })))
      }
    }
    cargar()
  }, [])

  const seleccionar = (cat: CategoriaOption) => {
    onChange({ categoryId: cat.id, categoryName: cat.name, suggestedCategory: '' })
    setShowSuggestion(false)
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">¿Qué quieres alquilar?</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {categorias.map((cat) => (
          <button
            key={cat.id}
            onClick={() => seleccionar(cat)}
            className={`flex flex-col items-center rounded-xl border-2 p-4 transition-colors ${
              datos.categoryId === cat.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-2xl">{cat.icon}</span>
            <span className="mt-2 text-sm font-medium">{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-4">
        <button
          onClick={() => setShowSuggestion(!showSuggestion)}
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          ¿No encuentras tu categoría? Sugiere una nueva
        </button>

        {showSuggestion && (
          <div className="mt-2">
            <Input
              label="Categoría sugerida"
              value={datos.suggestedCategory}
              onChange={(e) => onChange({ suggestedCategory: e.target.value, categoryId: '', categoryName: '' })}
              placeholder="Ej: Instrumentos médicos"
            />
          </div>
        )}
      </div>

      {errores.categoryId && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {errores.categoryId}
        </p>
      )}
    </div>
  )
}

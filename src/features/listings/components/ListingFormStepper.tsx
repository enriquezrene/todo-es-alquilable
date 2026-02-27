'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/shared/providers/AuthProvider'
import { useToast } from '@/shared/providers/ToastProvider'
import { crearAnuncio } from '@/features/listings/services/listing-service'
import { subirImagenesAnuncio } from '@/features/listings/services/image-service'
import {
  validarPasoCategoria,
  validarPasoFotos,
  validarPasoDetalles,
  validarPasoPrecio,
} from '@/features/listings/services/validar-anuncio'
import type { FormularioAnuncio, PasoFormulario } from '../types'
import { PASOS_FORMULARIO, ETIQUETAS_PASO } from '../types'
import type { ErroresFormulario } from '@/features/auth/types'
import StepCategoria from './StepCategoria'
import StepFotos from './StepFotos'
import StepDetalles from './StepDetalles'
import StepPrecio from './StepPrecio'
import StepRevision from './StepRevision'
import Button from '@/shared/components/ui/Button'

export default function ListingFormStepper() {
  const router = useRouter()
  const { user } = useAuth()
  const { mostrarToast } = useToast()
  const [pasoActual, setPasoActual] = useState<PasoFormulario>('categoria')
  const [loading, setLoading] = useState(false)
  const [errores, setErrores] = useState<ErroresFormulario>({})

  const [datos, setDatos] = useState<FormularioAnuncio>({
    title: '',
    description: '',
    categoryId: '',
    categoryName: '',
    suggestedCategory: '',
    condition: '',
    price: '',
    priceUnit: '',
    province: '',
    images: [],
    imagesPreviews: [],
  })

  const indiceActual = PASOS_FORMULARIO.indexOf(pasoActual)

  const validarPasoActual = (): boolean => {
    const validadores: Record<PasoFormulario, () => ErroresFormulario> = {
      categoria: () => validarPasoCategoria(datos),
      fotos: () => validarPasoFotos(datos),
      detalles: () => validarPasoDetalles(datos),
      precio: () => validarPasoPrecio(datos),
      revision: () => ({}),
    }

    const nuevosErrores = validadores[pasoActual]()
    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const siguiente = () => {
    if (!validarPasoActual()) return
    if (indiceActual < PASOS_FORMULARIO.length - 1) {
      setPasoActual(PASOS_FORMULARIO[indiceActual + 1])
      setErrores({})
    }
  }

  const anterior = () => {
    if (indiceActual > 0) {
      setPasoActual(PASOS_FORMULARIO[indiceActual - 1])
      setErrores({})
    }
  }

  const irAPaso = (paso: PasoFormulario) => {
    const indicePaso = PASOS_FORMULARIO.indexOf(paso)
    if (indicePaso <= indiceActual) {
      setPasoActual(paso)
      setErrores({})
    }
  }

  const handleSubmit = async () => {
    if (!user) return

    setLoading(true)
    try {
      const listingId = await crearAnuncio({
        title: datos.title.trim(),
        description: datos.description.trim(),
        categoryId: datos.categoryId,
        categoryName: datos.categoryName,
        condition: datos.condition,
        price: parseFloat(datos.price),
        priceUnit: datos.priceUnit,
        province: datos.province,
        images: [],
        ownerId: user.uid,
        ownerName: user.displayName || '',
        ownerPhone: '',
        ownerPhotoURL: user.photoURL,
      })

      if (datos.images.length > 0) {
        const urls = await subirImagenesAnuncio(listingId, datos.images)
        const { actualizarAnuncio } = await import('@/features/listings/services/listing-service')
        await actualizarAnuncio(listingId, { images: urls })
      }

      mostrarToast('Anuncio publicado. Será revisado pronto.', 'success')
      router.push('/mis-anuncios')
    } catch {
      mostrarToast('Error al publicar el anuncio', 'error')
    } finally {
      setLoading(false)
    }
  }

  const actualizarDatos = (updates: Partial<FormularioAnuncio>) => {
    setDatos((prev) => ({ ...prev, ...updates }))
  }

  return (
    <div>
      <nav className="mb-8 flex items-center justify-center gap-2">
        {PASOS_FORMULARIO.map((paso, i) => (
          <button
            key={paso}
            onClick={() => irAPaso(paso)}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              paso === pasoActual
                ? 'bg-blue-600 text-white'
                : i < indiceActual
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-400'
            }`}
            disabled={i > indiceActual}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">
              {i + 1}
            </span>
            <span className="hidden sm:inline">{ETIQUETAS_PASO[paso]}</span>
          </button>
        ))}
      </nav>

      <div className="mx-auto max-w-2xl">
        {pasoActual === 'categoria' && (
          <StepCategoria datos={datos} errores={errores} onChange={actualizarDatos} />
        )}
        {pasoActual === 'fotos' && (
          <StepFotos datos={datos} errores={errores} onChange={actualizarDatos} />
        )}
        {pasoActual === 'detalles' && (
          <StepDetalles datos={datos} errores={errores} onChange={actualizarDatos} />
        )}
        {pasoActual === 'precio' && (
          <StepPrecio datos={datos} errores={errores} onChange={actualizarDatos} />
        )}
        {pasoActual === 'revision' && (
          <StepRevision datos={datos} onEditStep={irAPaso} />
        )}

        <div className="mt-8 flex justify-between">
          <Button
            variant="outline"
            onClick={anterior}
            disabled={indiceActual === 0}
          >
            Anterior
          </Button>

          {pasoActual === 'revision' ? (
            <Button onClick={handleSubmit} loading={loading}>
              Publicar anuncio
            </Button>
          ) : (
            <Button onClick={siguiente}>Siguiente</Button>
          )}
        </div>
      </div>
    </div>
  )
}

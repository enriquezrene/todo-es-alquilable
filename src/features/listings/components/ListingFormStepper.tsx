'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/shared/providers/AuthProvider'
import { useToast } from '@/shared/providers/ToastProvider'
import { crearAnuncio } from '@/features/listings/services/listing-service'
import { subirImagenesComprimidas } from '@/features/listings/services/image-service'
import {
  validarPasoCategoria,
  validarPasoFotos,
  validarPasoDetalles,
  validarPasoPrecio,
} from '@/features/listings/services/validar-anuncio'
import type { FormularioAnuncio, ImagenSlot, PasoFormulario } from '../types'
import { PASOS_FORMULARIO, ETIQUETAS_PASO } from '../types'
import type { ErroresFormulario } from '@/features/auth/types'
import { registrarError } from '@/lib/registrar-error'
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
    imageSlots: [],
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
      const t0 = performance.now()

      const nuevas = datos.imageSlots.filter(
        (s): s is Extract<ImagenSlot, { tipo: 'nueva' }> => s.tipo === 'nueva'
      )

      // Start image compression immediately while loading Firestore chunk
      const compressionPromise = nuevas.length > 0
        ? import('@/lib/imagenes/comprimir-imagen').then(({ procesarImagenes }) => procesarImagenes(nuevas.map(s => s.file)))
        : Promise.resolve([])

      const { doc: createDocRef, collection: getCollection, getDb } = await import('@/lib/firebase/firebase-firestore')
      const listingId = createDocRef(getCollection(getDb(), 'listings')).id
      console.log(`[timing] Firestore import + doc ID: ${Math.round(performance.now() - t0)}ms`)

      // Upload compressed images
      const processed = await compressionPromise
      const t1 = performance.now()
      console.log(`[timing] Image compression (${nuevas.length} images, ${processed.map(p => `full:${(p.full.size / 1024).toFixed(0)}KB thumb:${(p.thumbnail.size / 1024).toFixed(0)}KB`).join(', ')}): ${Math.round(t1 - t0)}ms`)

      const { imageUrls, thumbnailUrls } = processed.length > 0
        ? await subirImagenesComprimidas(listingId, processed)
        : { imageUrls: [] as string[], thumbnailUrls: [] as string[] }
      console.log(`[timing] Upload to Storage: ${Math.round(performance.now() - t1)}ms`)

      const t2 = performance.now()
      await crearAnuncio({
        title: datos.title.trim(),
        description: datos.description.trim(),
        categoryId: datos.categoryId,
        categoryName: datos.categoryName,
        condition: datos.condition,
        price: parseFloat(datos.price),
        priceUnit: datos.priceUnit,
        province: datos.province,
        images: imageUrls,
        thumbnails: thumbnailUrls,
        ownerId: user.uid,
        ownerName: user.displayName || '',
        // ownerPhone is now fetched dynamically from user profile
        ownerPhotoURL: user.photoURL,
      }, listingId)
      console.log(`[timing] Firestore write: ${Math.round(performance.now() - t2)}ms`)
      console.log(`[timing] TOTAL: ${Math.round(performance.now() - t0)}ms`)

      mostrarToast('Anuncio publicado. Será revisado pronto.', 'success')
      router.push('/mis-anuncios')
    } catch (error) {
      registrarError(error, 'ListingFormStepper:publicar')
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

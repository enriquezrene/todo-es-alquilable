'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/shared/providers/AuthProvider'
import { useToast } from '@/shared/providers/ToastProvider'
import { reenviarAnuncio } from '@/features/listings/services/listing-service'
import { subirImagenesComprimidas } from '@/features/listings/services/image-service'
import {
  validarPasoCategoria,
  validarPasoFotos,
  validarPasoDetalles,
  validarPasoPrecio,
} from '@/features/listings/services/validar-anuncio'
import type { FormularioAnuncio, ImagenSlot } from '../types'
import type { ErroresFormulario } from '@/features/auth/types'
import type { Anuncio } from '@/shared/types/anuncio'
import { registrarError } from '@/lib/registrar-error'
import StepCategoria from './StepCategoria'
import StepFotos from './StepFotos'
import StepDetalles from './StepDetalles'
import StepPrecio from './StepPrecio'
import Button from '@/shared/components/ui/Button'

type Props = {
  anuncio: Anuncio
}

function buildInitialDatos(anuncio: Anuncio): FormularioAnuncio {
  const imageSlots: ImagenSlot[] = anuncio.images.map((url, i) => ({
    tipo: 'existente',
    url,
    thumbnail: anuncio.thumbnails[i] || url,
  }))

  return {
    title: anuncio.title,
    description: anuncio.description,
    categoryId: anuncio.categoryId,
    categoryName: anuncio.categoryName,
    suggestedCategory: '',
    condition: anuncio.condition,
    price: String(anuncio.price),
    priceUnit: anuncio.priceUnit,
    province: anuncio.province,
    imageSlots,
  }
}

export default function ListingEditForm({ anuncio }: Props) {
  const router = useRouter()
  const { user } = useAuth()
  const { mostrarToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [errores, setErrores] = useState<ErroresFormulario>({})
  const [datos, setDatos] = useState<FormularioAnuncio>(() => buildInitialDatos(anuncio))

  const actualizarDatos = (updates: Partial<FormularioAnuncio>) => {
    setDatos((prev) => ({ ...prev, ...updates }))
  }

  const validarTodo = (): boolean => {
    const todosErrores = {
      ...validarPasoCategoria(datos),
      ...validarPasoFotos(datos),
      ...validarPasoDetalles(datos),
      ...validarPasoPrecio(datos),
    }
    setErrores(todosErrores)
    return Object.keys(todosErrores).length === 0
  }

  const handleSubmit = async () => {
    if (!user || !validarTodo()) return

    setLoading(true)
    try {
      const existentes = datos.imageSlots.filter(
        (s): s is Extract<ImagenSlot, { tipo: 'existente' }> => s.tipo === 'existente'
      )
      const nuevas = datos.imageSlots.filter(
        (s): s is Extract<ImagenSlot, { tipo: 'nueva' }> => s.tipo === 'nueva'
      )

      let newImageUrls: string[] = []
      let newThumbnailUrls: string[] = []

      if (nuevas.length > 0) {
        const { procesarImagenes } = await import('@/lib/imagenes/comprimir-imagen')
        const processed = await procesarImagenes(nuevas.map((s) => s.file))
        const uploaded = await subirImagenesComprimidas(anuncio.id, processed, existentes.length)
        newImageUrls = uploaded.imageUrls
        newThumbnailUrls = uploaded.thumbnailUrls
      }

      // Merge in slot order
      const finalImageUrls: string[] = []
      const finalThumbnailUrls: string[] = []
      let newIdx = 0
      for (const slot of datos.imageSlots) {
        if (slot.tipo === 'existente') {
          finalImageUrls.push(slot.url)
          finalThumbnailUrls.push(slot.thumbnail)
        } else {
          finalImageUrls.push(newImageUrls[newIdx])
          finalThumbnailUrls.push(newThumbnailUrls[newIdx])
          newIdx++
        }
      }

      await reenviarAnuncio(anuncio.id, {
        title: datos.title.trim(),
        description: datos.description.trim(),
        categoryId: datos.categoryId,
        categoryName: datos.categoryName,
        condition: datos.condition,
        price: parseFloat(datos.price),
        priceUnit: datos.priceUnit,
        province: datos.province,
        images: finalImageUrls,
        thumbnails: finalThumbnailUrls,
      })

      mostrarToast('Anuncio reenviado para revisión.', 'success')
      router.push('/mis-anuncios')
    } catch (error) {
      registrarError(error, 'ListingEditForm:reenviar')
      mostrarToast('Error al reenviar el anuncio', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <section>
        <StepCategoria datos={datos} errores={errores} onChange={actualizarDatos} />
      </section>

      <hr className="border-gray-200" />

      <section>
        <StepFotos datos={datos} errores={errores} onChange={actualizarDatos} />
      </section>

      <hr className="border-gray-200" />

      <section>
        <StepDetalles datos={datos} errores={errores} onChange={actualizarDatos} />
      </section>

      <hr className="border-gray-200" />

      <section>
        <StepPrecio datos={datos} errores={errores} onChange={actualizarDatos} />
      </section>

      <div className="pt-4">
        <Button onClick={handleSubmit} loading={loading} className="w-full">
          Reenviar para revisión
        </Button>
      </div>
    </div>
  )
}

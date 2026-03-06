'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/shared/providers/AuthProvider'
import { useToast } from '@/shared/providers/ToastProvider'
import {
  obtenerAnunciosPendientes,
  aprobarAnuncio,
  rechazarAnuncio,
  solicitarCambios,
} from '@/features/admin/services/moderation-service'
import { actualizarAnuncio } from '@/features/listings/services/listing-service'
import ListingReviewCard from '@/features/admin/components/ListingReviewCard'
import Spinner from '@/shared/components/ui/Spinner'
import EmptyState from '@/shared/components/feedback/EmptyState'
import { registrarError } from '@/lib/registrar-error'
import type { Anuncio } from '@/shared/types/anuncio'

export default function PendientesPage() {
  const { user } = useAuth()
  const { mostrarToast } = useToast()
  const [anuncios, setAnuncios] = useState<Anuncio[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function cargar() {
      try {
        const data = await obtenerAnunciosPendientes()
        setAnuncios(data)
      } catch (e) {
        registrarError(e, 'PendientesPage:cargar')
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  const removeFromList = (id: string) => {
    setAnuncios((prev) => prev.filter((a) => a.id !== id))
  }

  const handleApprove = async (id: string) => {
    if (!user) return
    try {
      await aprobarAnuncio(id, user.uid)
      removeFromList(id)
      mostrarToast('Anuncio aprobado', 'success')
    } catch (e) {
      registrarError(e, 'PendientesPage:aprobar')
      mostrarToast('Error al aprobar el anuncio', 'error')
    }
  }

  const handleReject = async (id: string, reason: string) => {
    if (!user) return
    try {
      await rechazarAnuncio(id, user.uid, reason)
      removeFromList(id)
      mostrarToast('Anuncio rechazado', 'info')
    } catch (e) {
      registrarError(e, 'PendientesPage:rechazar')
      mostrarToast('Error al rechazar el anuncio', 'error')
    }
  }

  const handleRequestChanges = async (id: string, reason: string) => {
    if (!user) return
    try {
      await solicitarCambios(id, user.uid, reason)
      removeFromList(id)
      mostrarToast('Cambios solicitados', 'info')
    } catch (e) {
      registrarError(e, 'PendientesPage:solicitar-cambios')
      mostrarToast('Error al solicitar cambios', 'error')
    }
  }

  const handleEditAndApprove = async (id: string, data: Partial<Anuncio>) => {
    if (!user) return
    try {
      if (Object.keys(data).length > 0) {
        if (data.title) data.titleLower = data.title.toLowerCase()
        await actualizarAnuncio(id, data)
      }
      await aprobarAnuncio(id, user.uid)
      removeFromList(id)
      mostrarToast('Anuncio editado y aprobado', 'success')
    } catch (e) {
      registrarError(e, 'PendientesPage:editar-aprobar')
      mostrarToast('Error al editar y aprobar', 'error')
    }
  }

  if (loading) return <Spinner size="lg" />

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Anuncios pendientes ({anuncios.length})
      </h1>

      {anuncios.length === 0 ? (
        <EmptyState title="Sin anuncios pendientes" description="No hay anuncios por revisar en este momento." />
      ) : (
        <div className="space-y-4">
          {anuncios.map((anuncio) => (
            <ListingReviewCard
              key={anuncio.id}
              anuncio={anuncio}
              onApprove={handleApprove}
              onReject={handleReject}
              onRequestChanges={handleRequestChanges}
              onEditAndApprove={handleEditAndApprove}
            />
          ))}
        </div>
      )}
    </div>
  )
}

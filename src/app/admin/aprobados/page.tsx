'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/shared/providers/AuthProvider'
import { useToast } from '@/shared/providers/ToastProvider'
import {
  obtenerAnunciosAprobados,
  rechazarAnuncio,
  solicitarCambios,
  eliminarAnuncio,
} from '@/features/admin/services/moderation-service'
import { actualizarAnuncio } from '@/features/listings/services/listing-service'
import ActiveListingCard from '@/features/admin/components/ActiveListingCard'
import Spinner from '@/shared/components/ui/Spinner'
import EmptyState from '@/shared/components/feedback/EmptyState'
import { registrarError } from '@/lib/registrar-error'
import type { Anuncio } from '@/shared/types/anuncio'

export default function AprobadosPage() {
  const { user } = useAuth()
  const { mostrarToast } = useToast()
  const [anuncios, setAnuncios] = useState<Anuncio[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function cargar() {
      try {
        const data = await obtenerAnunciosAprobados()
        setAnuncios(data)
      } catch (e) {
        registrarError(e, 'AprobadosPage:cargar')
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  const removeFromList = (id: string) => {
    setAnuncios((prev) => prev.filter((a) => a.id !== id))
  }

  const handleReject = async (id: string, reason: string) => {
    if (!user) return
    try {
      await rechazarAnuncio(id, user.uid, reason)
      removeFromList(id)
      mostrarToast('Anuncio rechazado', 'info')
    } catch (e) {
      registrarError(e, 'AprobadosPage:rechazar')
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
      registrarError(e, 'AprobadosPage:solicitar-cambios')
      mostrarToast('Error al solicitar cambios', 'error')
    }
  }

  const handleDelete = async (id: string) => {
    if (!user) return
    if (!confirm('¿Estás seguro de que quieres eliminar este anuncio? Esta acción no se puede deshacer.')) {
      return
    }
    try {
      await eliminarAnuncio(id)
      removeFromList(id)
      mostrarToast('Anuncio eliminado', 'success')
    } catch (e) {
      registrarError(e, 'AprobadosPage:eliminar')
      mostrarToast('Error al eliminar el anuncio', 'error')
    }
  }

  const handleEdit = async (id: string, data: Partial<Anuncio>) => {
    if (!user) return
    try {
      if (Object.keys(data).length > 0) {
        if (data.title) data.titleLower = data.title.toLowerCase()
        await actualizarAnuncio(id, data)
      }
      mostrarToast('Anuncio actualizado', 'success')
    } catch (e) {
      registrarError(e, 'AprobadosPage:editar')
      mostrarToast('Error al actualizar el anuncio', 'error')
    }
  }

  if (loading) return <Spinner size="lg" />

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Anuncios activos ({anuncios.length})
      </h1>

      {anuncios.length === 0 ? (
        <EmptyState title="Sin anuncios activos" description="No hay anuncios aprobados en este momento." />
      ) : (
        <div className="space-y-4">
          {anuncios.map((anuncio) => (
            <ActiveListingCard
              key={anuncio.id}
              anuncio={anuncio}
              onReject={handleReject}
              onRequestChanges={handleRequestChanges}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  )
}

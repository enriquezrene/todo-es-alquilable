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
import ListingReviewCard from '@/features/admin/components/ListingReviewCard'
import Spinner from '@/shared/components/ui/Spinner'
import EmptyState from '@/shared/components/feedback/EmptyState'
import type { Anuncio } from '@/shared/types/anuncio'

export default function PendientesPage() {
  const { user } = useAuth()
  const { mostrarToast } = useToast()
  const [anuncios, setAnuncios] = useState<Anuncio[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function cargar() {
      const data = await obtenerAnunciosPendientes()
      setAnuncios(data)
      setLoading(false)
    }
    cargar()
  }, [])

  const removeFromList = (id: string) => {
    setAnuncios((prev) => prev.filter((a) => a.id !== id))
  }

  const handleApprove = async (id: string) => {
    if (!user) return
    await aprobarAnuncio(id, user.uid)
    removeFromList(id)
    mostrarToast('Anuncio aprobado', 'success')
  }

  const handleReject = async (id: string, reason: string) => {
    if (!user) return
    await rechazarAnuncio(id, user.uid, reason)
    removeFromList(id)
    mostrarToast('Anuncio rechazado', 'info')
  }

  const handleRequestChanges = async (id: string, reason: string) => {
    if (!user) return
    await solicitarCambios(id, user.uid, reason)
    removeFromList(id)
    mostrarToast('Cambios solicitados', 'info')
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
            />
          ))}
        </div>
      )}
    </div>
  )
}

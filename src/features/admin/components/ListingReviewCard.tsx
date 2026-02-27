'use client'

import { useState } from 'react'
import type { Anuncio } from '@/shared/types/anuncio'
import { formatearPrecio } from '@/lib/dominio/formatear-precio'
import { formatearFecha } from '@/lib/dominio/formatear-fecha'
import Button from '@/shared/components/ui/Button'
import Badge from '@/shared/components/ui/Badge'

type ListingReviewCardProps = {
  anuncio: Anuncio
  onApprove: (id: string) => void
  onReject: (id: string, reason: string) => void
  onRequestChanges: (id: string, reason: string) => void
}

export default function ListingReviewCard({
  anuncio,
  onApprove,
  onReject,
  onRequestChanges,
}: ListingReviewCardProps) {
  const [reason, setReason] = useState('')
  const [showReason, setShowReason] = useState(false)
  const [action, setAction] = useState<'reject' | 'changes' | null>(null)

  const handleAction = (type: 'reject' | 'changes') => {
    setAction(type)
    setShowReason(true)
  }

  const handleConfirm = () => {
    if (!reason.trim()) return
    if (action === 'reject') onReject(anuncio.id, reason)
    else if (action === 'changes') onRequestChanges(anuncio.id, reason)
    setShowReason(false)
    setReason('')
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex gap-4">
        {anuncio.images[0] && (
          <img
            src={anuncio.images[0]}
            alt={anuncio.title}
            className="h-24 w-24 flex-shrink-0 rounded-lg object-cover"
          />
        )}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-gray-900">{anuncio.title}</h3>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">{anuncio.description}</p>
            </div>
            <Badge variant="info">{anuncio.categoryName}</Badge>
          </div>
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
            <span>{formatearPrecio(anuncio.price, anuncio.priceUnit)}</span>
            <span>{anuncio.province}</span>
            <span>{anuncio.ownerName}</span>
            <span>{formatearFecha(anuncio.createdAt)}</span>
          </div>
        </div>
      </div>

      {showReason ? (
        <div className="mt-4 space-y-2">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={action === 'reject' ? 'Motivo del rechazo...' : 'Cambios requeridos...'}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            rows={2}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleConfirm} disabled={!reason.trim()}>
              Confirmar
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowReason(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex gap-2">
          <Button size="sm" onClick={() => onApprove(anuncio.id)}>
            Aprobar
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleAction('changes')}>
            Solicitar cambios
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleAction('reject')}>
            Rechazar
          </Button>
        </div>
      )}
    </div>
  )
}

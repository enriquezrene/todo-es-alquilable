import { useState } from 'react'
import Link from 'next/link'
import { formatearPrecio } from '@/lib/dominio/formatear-precio'
import { formatearFecha } from '@/lib/dominio/formatear-fecha'
import type { Anuncio } from '@/shared/types/anuncio'
import type { UnidadPrecio } from '@/lib/dominio/unidades-precio'
import Badge from '@/shared/components/ui/Badge'
import Button from '@/shared/components/ui/Button'

type ActiveListingCardProps = {
  anuncio: Anuncio
  onReject: (id: string, reason: string) => void
  onRequestChanges: (id: string, reason: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, data: Partial<Anuncio>) => void
}

export default function ActiveListingCard({ 
  anuncio, 
  onReject, 
  onRequestChanges, 
  onDelete,
  onEdit 
}: ActiveListingCardProps) {
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [showChangesForm, setShowChangesForm] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [changesReason, setChangesReason] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<{
    title: string
    description: string
    price: number
    priceUnit: UnidadPrecio
  }>({
    title: anuncio.title,
    description: anuncio.description,
    price: anuncio.price,
    priceUnit: anuncio.priceUnit,
  })

  const imageSrc = anuncio.thumbnails[0] || anuncio.images[0] || '/placeholder.svg'

  const handleReject = () => {
    if (rejectReason.trim()) {
      onReject(anuncio.id, rejectReason)
      setShowRejectForm(false)
      setRejectReason('')
    }
  }

  const handleRequestChanges = () => {
    if (changesReason.trim()) {
      onRequestChanges(anuncio.id, changesReason)
      setShowChangesForm(false)
      setChangesReason('')
    }
  }

  const handleEdit = () => {
    onEdit(anuncio.id, {
      title: editData.title,
      description: editData.description,
      price: editData.price,
      priceUnit: editData.priceUnit,
    })
    setIsEditing(false)
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <img
            src={imageSrc}
            alt={anuncio.title}
            className="h-24 w-24 rounded-lg object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <Link 
                href={`/anuncio/${anuncio.id}`}
                className="block truncate text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
              >
                {anuncio.title}
              </Link>
              
              <p className="mt-1 text-xl font-bold text-blue-600">
                {formatearPrecio(anuncio.price, anuncio.priceUnit)}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                <span>{anuncio.province}</span>
                <Badge>{anuncio.categoryName}</Badge>
                <span>•</span>
                <span>Por: {anuncio.ownerName}</span>
              </div>

              <p className="mt-1 text-xs text-gray-500">
                Publicado: {formatearFecha(anuncio.createdAt)}
              </p>
            </div>

            <div className="flex flex-shrink-0 flex-col gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancelar' : 'Editar'}
              </Button>
            </div>
          </div>

          {isEditing && (
            <div className="mt-4 space-y-3 border-t pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Título</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Precio</label>
                  <input
                    type="number"
                    value={editData.price}
                    onChange={(e) => setEditData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Unidad</label>
                  <select
                    value={editData.priceUnit}
                    onChange={(e) => setEditData(prev => ({ ...prev, priceUnit: e.target.value as UnidadPrecio }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="dia">Día</option>
                    <option value="hora">Hora</option>
                    <option value="mes">Mes</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleEdit} size="sm">
                  Guardar cambios
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-2 border-t pt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowRejectForm(!showRejectForm)}
            >
              Rechazar
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowChangesForm(!showChangesForm)}
            >
              Solicitar cambios
            </Button>

            <Button
              size="sm"
              variant="danger"
              onClick={() => onDelete(anuncio.id)}
            >
              Eliminar
            </Button>
          </div>

          {showRejectForm && (
            <div className="mt-3 border-t pt-3">
              <textarea
                placeholder="Razón del rechazo..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                className="mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <Button onClick={handleReject} size="sm">
                  Confirmar rechazo
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setShowRejectForm(false)
                    setRejectReason('')
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {showChangesForm && (
            <div className="mt-3 border-t pt-3">
              <textarea
                placeholder="Cambios solicitados..."
                value={changesReason}
                onChange={(e) => setChangesReason(e.target.value)}
                rows={3}
                className="mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <Button onClick={handleRequestChanges} size="sm">
                  Solicitar cambios
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setShowChangesForm(false)
                    setChangesReason('')
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

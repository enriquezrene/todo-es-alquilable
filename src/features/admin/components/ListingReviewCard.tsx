'use client'

import { useState } from 'react'
import type { Anuncio } from '@/shared/types/anuncio'
import { formatearPrecio } from '@/lib/dominio/formatear-precio'
import { formatearFecha } from '@/lib/dominio/formatear-fecha'
import { etiquetasCondicion, type CondicionArticulo } from '@/lib/dominio/condiciones-articulo'
import { provinciasEcuador } from '@/lib/dominio/provincias-ecuador'
import { categoriasIniciales } from '@/lib/dominio/categorias-iniciales'
import Button from '@/shared/components/ui/Button'
import Badge from '@/shared/components/ui/Badge'
import Input from '@/shared/components/ui/Input'
import Select from '@/shared/components/ui/Select'

type ListingReviewCardProps = {
  anuncio: Anuncio
  onApprove: (id: string) => void
  onReject: (id: string, reason: string) => void
  onRequestChanges: (id: string, reason: string) => void
  onEditAndApprove: (id: string, data: Partial<Anuncio>) => void
}

const conditionOptions = Object.entries(etiquetasCondicion).map(([value, label]) => ({ value, label }))
const provinceOptions = provinciasEcuador.map((p) => ({ value: p.nombre, label: p.nombre }))
const categoryOptions = categoriasIniciales.map((c) => ({ value: c.nombre, label: `${c.icono} ${c.nombre}` }))

export default function ListingReviewCard({
  anuncio,
  onApprove,
  onReject,
  onRequestChanges,
  onEditAndApprove,
}: ListingReviewCardProps) {
  const [reason, setReason] = useState('')
  const [showReason, setShowReason] = useState(false)
  const [action, setAction] = useState<'reject' | 'changes' | null>(null)
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({
    title: anuncio.title,
    description: anuncio.description,
    condition: anuncio.condition as string,
    province: anuncio.province,
    categoryName: anuncio.categoryName,
  })

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

  const handleSaveAndApprove = () => {
    const changes: Partial<Anuncio> = {}
    if (editData.title.trim() !== anuncio.title) changes.title = editData.title.trim()
    if (editData.description.trim() !== anuncio.description) changes.description = editData.description.trim()
    if (editData.condition !== anuncio.condition) changes.condition = editData.condition as CondicionArticulo
    if (editData.province !== anuncio.province) changes.province = editData.province
    if (editData.categoryName !== anuncio.categoryName) changes.categoryName = editData.categoryName

    onEditAndApprove(anuncio.id, changes)
  }

  if (editing) {
    return (
      <div className="rounded-xl border border-blue-200 bg-blue-50/30 p-4">
        <div className="flex gap-4">
          {anuncio.images[0] && (
            <img
              src={anuncio.images[0]}
              alt={anuncio.title}
              className="h-24 w-24 flex-shrink-0 rounded-lg object-cover"
            />
          )}
          <div className="flex-1 space-y-3">
            <Input
              label="Título"
              value={editData.title}
              onChange={(e) => setEditData((d) => ({ ...d, title: e.target.value }))}
            />
            <div className="w-full">
              <label className="mb-1 block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                value={editData.description}
                onChange={(e) => setEditData((d) => ({ ...d, description: e.target.value }))}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Select
                label="Categoría"
                value={editData.categoryName}
                onChange={(e) => setEditData((d) => ({ ...d, categoryName: e.target.value }))}
                options={categoryOptions}
              />
              <Select
                label="Condición"
                value={editData.condition}
                onChange={(e) => setEditData((d) => ({ ...d, condition: e.target.value }))}
                options={conditionOptions}
              />
              <Select
                label="Provincia"
                value={editData.province}
                onChange={(e) => setEditData((d) => ({ ...d, province: e.target.value }))}
                options={provinceOptions}
              />
            </div>
            <p className="text-sm text-gray-500">
              Precio: <span className="font-medium text-gray-700">{formatearPrecio(anuncio.price, anuncio.priceUnit)}</span> (no editable)
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button size="sm" onClick={handleSaveAndApprove}>
            Guardar y aprobar
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
            Cancelar
          </Button>
        </div>
      </div>
    )
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
          <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
            Editar
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

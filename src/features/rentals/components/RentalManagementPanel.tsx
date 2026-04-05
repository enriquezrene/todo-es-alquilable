'use client'

import { useState, useEffect, useCallback } from 'react'
import { actualizarEstadoSolicitud, actualizarEstadoAnuncio, obtenerSolicitudesPorAnuncio } from '../services/rental-service'
import { marcarAnuncioComoAlquilado } from '../services/rental-service'
import type { SolicitudRenta, FormularioMarcarAlquilado, ErroresFormularioMarcarAlquilado } from '../types'
import type { Anuncio } from '@/shared/types/anuncio'
import Button from '@/shared/components/ui/Button'
import Badge from '@/shared/components/ui/Badge'
import Modal from '@/shared/components/ui/Modal'
import Input from '@/shared/components/ui/Input'
import { formatearFecha } from '@/lib/dominio/formatear-fecha'
import { registrarError } from '@/lib/registrar-error'

type Props = {
  anuncio: Anuncio
}

const ESTADOS_ETIQUETAS = {
  pendiente: { label: 'Pendiente', color: 'warning' as const },
  aprobada: { label: 'Aprobada', color: 'success' as const },
  rechazada: { label: 'Rechazada', color: 'error' as const }
} as const

export default function RentalManagementPanel({ anuncio }: Props) {
  const [solicitudes, setSolicitudes] = useState<SolicitudRenta[]>([])
  const [loading, setLoading] = useState(true)
  const [showMarkRentedModal, setShowMarkRentedModal] = useState(false)
  const [markRentedForm, setMarkRentedForm] = useState<FormularioMarcarAlquilado>({
    startDateTime: '',
    endDateTime: '',
    renterEmail: ''
  })
  const [markRentedErrors, setMarkRentedErrors] = useState<ErroresFormularioMarcarAlquilado>({
    startDateTime: '',
    endDateTime: '',
    renterEmail: ''
  })
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const cargarSolicitudes = useCallback(async () => {
    setLoading(true)
    try {
      const data = await obtenerSolicitudesPorAnuncio(anuncio.id)
      setSolicitudes(data)
    } catch (error) {
      registrarError(error, 'RentalManagementPanel:cargarSolicitudes')
    } finally {
      setLoading(false)
    }
  }, [anuncio.id])

  useEffect(() => {
    cargarSolicitudes()
  }, [cargarSolicitudes])

  const handleActualizarSolicitud = async (solicitudId: string, nuevoEstado: 'aprobada' | 'rechazada') => {
    setActionLoading(solicitudId)
    try {
      await actualizarEstadoSolicitud(solicitudId, nuevoEstado)
      await cargarSolicitudes()
      
      // If approved, you might want to update the listing availability
      if (nuevoEstado === 'aprobada') {
        await actualizarEstadoAnuncio(anuncio.id, 'alquilado')
      }
    } catch (error) {
      registrarError(error, 'RentalManagementPanel:handleActualizarSolicitud')
      alert('Error al actualizar la solicitud. Por favor intenta nuevamente.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleMarkAsRented = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const errores: ErroresFormularioMarcarAlquilado = {
      startDateTime: '',
      endDateTime: '',
      renterEmail: ''
    }

    let esValido = true

    if (!markRentedForm.startDateTime) {
      errores.startDateTime = 'La fecha y hora de inicio son requeridas'
      esValido = false
    }

    if (!markRentedForm.endDateTime) {
      errores.endDateTime = 'La fecha y hora de fin son requeridas'
      esValido = false
    } else if (markRentedForm.startDateTime && new Date(markRentedForm.endDateTime) <= new Date(markRentedForm.startDateTime)) {
      errores.endDateTime = 'La fecha de fin debe ser posterior a la fecha de inicio'
      esValido = false
    }

    if (!markRentedForm.renterEmail.trim()) {
      errores.renterEmail = 'El email del renter es requerido'
      esValido = false
    } else if (!markRentedForm.renterEmail.includes('@')) {
      errores.renterEmail = 'Ingresa un email válido'
      esValido = false
    }

    if (!esValido) {
      setMarkRentedErrors(errores)
      return
    }

    setActionLoading('mark-rented')
    try {
      await marcarAnuncioComoAlquilado(anuncio.id, markRentedForm)
      setShowMarkRentedModal(false)
      setMarkRentedForm({ startDateTime: '', endDateTime: '', renterEmail: '' })
      alert('Artículo marcado como alquilado correctamente')
    } catch (error) {
      registrarError(error, 'RentalManagementPanel:handleMarkAsRented')
      alert('Error al marcar el artículo como alquilado. Por favor intenta nuevamente.')
    } finally {
      setActionLoading(null)
    }
  }

  const solicitudesPendientes = solicitudes.filter(s => s.status === 'pendiente')

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 p-4">
        <div className="animate-pulse">
          <div className="mb-4 h-6 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Availability Status */}
      <div className="rounded-xl border border-gray-200 p-4">
        <h3 className="mb-3 font-semibold text-gray-900">Estado del artículo</h3>
        <div className="flex items-center justify-between">
          <Badge variant={anuncio.availabilityStatus === 'disponible' ? 'success' : 'warning'}>
            {anuncio.availabilityStatus === 'disponible' ? 'Disponible' : 'Alquilado'}
          </Badge>
          {anuncio.availabilityStatus === 'disponible' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowMarkRentedModal(true)}
            >
              Marcar como alquilado
            </Button>
          )}
        </div>
      </div>

      {/* Rental Requests */}
      <div className="rounded-xl border border-gray-200 p-4">
        <h3 className="mb-3 font-semibold text-gray-900">
          Solicitudes de renta ({solicitudesPendientes.length})
        </h3>
        
        {solicitudes.length === 0 ? (
          <p className="text-sm text-gray-500">No hay solicitudes de renta todavía</p>
        ) : (
          <div className="space-y-3">
            {solicitudes.map((solicitud) => (
              <div key={solicitud.id} className="rounded-lg border border-gray-100 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{solicitud.renterName}</p>
                    <p className="text-sm text-gray-500">{solicitud.renterEmail}</p>
                  </div>
                  <Badge variant={ESTADOS_ETIQUETAS[solicitud.status].color}>
                    {ESTADOS_ETIQUETAS[solicitud.status].label}
                  </Badge>
                </div>
                
                <div className="mb-2 text-sm text-gray-600">
                  <p>📅 Inicio: {formatearFecha(solicitud.startDateTime)}</p>
                  <p>📅 Fin: {formatearFecha(solicitud.endDateTime)}</p>
                </div>

                {solicitud.notes && (
                  <p className="mb-3 text-sm text-gray-600">
                    💬 {solicitud.notes}
                  </p>
                )}

                {solicitud.status === 'pendiente' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleActualizarSolicitud(solicitud.id, 'aprobada')}
                      disabled={actionLoading === solicitud.id}
                      className="flex-1"
                    >
                      {actionLoading === solicitud.id ? 'Procesando...' : 'Aprobar'}
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleActualizarSolicitud(solicitud.id, 'rechazada')}
                      disabled={actionLoading === solicitud.id}
                      className="flex-1"
                    >
                      {actionLoading === solicitud.id ? 'Procesando...' : 'Rechazar'}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mark as Rented Modal */}
      <Modal
        isOpen={showMarkRentedModal}
        onClose={() => setShowMarkRentedModal(false)}
        title="Marcar artículo como alquilado"
      >
        <form onSubmit={handleMarkAsRented} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Fecha y hora de inicio"
              type="datetime-local"
              value={markRentedForm.startDateTime}
              onChange={(e) => setMarkRentedForm(prev => ({ ...prev, startDateTime: e.target.value }))}
              error={markRentedErrors.startDateTime}
              required
              onKeyDown={(e) => e.preventDefault()}
              className="[&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:hover:bg-gray-100"
            />

            <Input
              label="Fecha y hora de fin"
              type="datetime-local"
              value={markRentedForm.endDateTime}
              onChange={(e) => setMarkRentedForm(prev => ({ ...prev, endDateTime: e.target.value }))}
              error={markRentedErrors.endDateTime}
              min={markRentedForm.startDateTime}
              required
              onKeyDown={(e) => e.preventDefault()}
              className="[&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:hover:bg-gray-100"
            />
          </div>

          <Input
            label="Email del renter"
            type="email"
            value={markRentedForm.renterEmail}
            onChange={(e) => setMarkRentedForm(prev => ({ ...prev, renterEmail: e.target.value }))}
            error={markRentedErrors.renterEmail}
            placeholder="email@ejemplo.com"
            required
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={actionLoading === 'mark-rented'}
              className="flex-1"
            >
              {actionLoading === 'mark-rented' ? 'Guardando...' : 'Marcar como alquilado'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowMarkRentedModal(false)}
              disabled={actionLoading === 'mark-rented'}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { crearSolicitudRenta } from '../services/rental-service'
import type { FormularioSolicitud, ErroresFormularioSolicitud } from '../types'
import type { Anuncio } from '@/shared/types/anuncio'
import Input from '@/shared/components/ui/Input'
import Button from '@/shared/components/ui/Button'
import { registrarError } from '@/lib/registrar-error'

type Props = {
  anuncio: Anuncio
  renterId: string
  onSuccess: () => void
  onCancel: () => void
}

export default function RentalRequestForm({ anuncio, renterId, onSuccess, onCancel }: Props) {
  const [datos, setDatos] = useState<FormularioSolicitud>({
    startDateTime: '',
    endDateTime: '',
    notes: ''
  })
  const [errores, setErrores] = useState<ErroresFormularioSolicitud>({
    startDateTime: '',
    endDateTime: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)

  const validarFormulario = (): boolean => {
    const nuevosErrores: ErroresFormularioSolicitud = {
      startDateTime: '',
      endDateTime: '',
      notes: ''
    }

    let esValido = true

    if (!datos.startDateTime) {
      nuevosErrores.startDateTime = 'La fecha y hora de inicio son requeridas'
      esValido = false
    }

    if (!datos.endDateTime) {
      nuevosErrores.endDateTime = 'La fecha y hora de fin son requeridas'
      esValido = false
    } else if (datos.startDateTime && new Date(datos.endDateTime) <= new Date(datos.startDateTime)) {
      nuevosErrores.endDateTime = 'La fecha de fin debe ser posterior a la fecha de inicio'
      esValido = false
    }

    if (new Date(datos.startDateTime) < new Date()) {
      nuevosErrores.startDateTime = 'La fecha de inicio no puede ser en el pasado'
      esValido = false
    }

    setErrores(nuevosErrores)
    return esValido
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validarFormulario()) {
      return
    }

    setLoading(true)
    try {
      await crearSolicitudRenta(anuncio.id, renterId, datos)
      onSuccess()
    } catch (error) {
      registrarError(error, 'RentalRequestForm:handleSubmit')
      if (error instanceof Error) {
        setErrores({
          startDateTime: error.message.includes('fechas') ? error.message : '',
          endDateTime: error.message.includes('fechas') ? error.message : '',
          notes: error.message.includes('fechas') ? '' : error.message
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (campo: keyof FormularioSolicitud, valor: string) => {
    setDatos(prev => ({ ...prev, [campo]: valor }))
    // Clear error when user starts typing
    if (errores[campo]) {
      setErrores(prev => ({ ...prev, [campo]: '' }))
    }
  }

  const getMinDateTime = () => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Solicitar renta: {anuncio.title}</h3>
        <p className="mb-4 text-sm text-gray-600">
          Por favor indica las fechas y horas en que deseas alquilar este artículo.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Fecha y hora de inicio"
          type="datetime-local"
          value={datos.startDateTime}
          onChange={(e) => handleChange('startDateTime', e.target.value)}
          error={errores.startDateTime}
          min={getMinDateTime()}
          required
          onKeyDown={(e) => e.preventDefault()}
          className="[&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:hover:bg-gray-100"
        />

        <Input
          label="Fecha y hora de fin"
          type="datetime-local"
          value={datos.endDateTime}
          onChange={(e) => handleChange('endDateTime', e.target.value)}
          error={errores.endDateTime}
          min={datos.startDateTime || getMinDateTime()}
          required
          onKeyDown={(e) => e.preventDefault()}
          className="[&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:hover:bg-gray-100"
        />
      </div>

      <div>
        <label htmlFor="notes" className="mb-1 block text-sm font-medium text-gray-700">
          Notas adicionales (opcional)
        </label>
        <textarea
          id="notes"
          value={datos.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
            errores.notes
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
          rows={3}
          placeholder="Algún detalle adicional que el lister deba conocer..."
        />
        {errores.notes && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errores.notes}
          </p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1"
        >
          {loading ? 'Enviando solicitud...' : 'Enviar solicitud'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="flex-1"
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}

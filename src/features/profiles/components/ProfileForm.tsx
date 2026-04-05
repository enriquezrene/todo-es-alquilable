'use client'

import { useState } from 'react'
import type { UserProfile } from '@/shared/types/user-profile'
import { crearPerfil } from '@/features/profiles/services/profile-service'
import Button from '@/shared/components/ui/Button'

type ProfileFormProps = {
  onProfileCreated?: (profileId: string) => void
}

export default function ProfileForm({ onProfileCreated }: ProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cedula: '',
    cedulaDocumentId: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const profile: Omit<UserProfile, 'id'> = {
        ...formData,
        role: 'renter',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const profileId = await crearPerfil(profile)
      
      if (onProfileCreated) {
        onProfileCreated(profileId)
      }
      
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        cedula: '',
        cedulaDocumentId: ''
      })
    } catch (error) {
      console.error('Error creating profile:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Crear Perfil de Renter
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre *
            </label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="Ej: Juan"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apellido *
            </label>
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="Ej: Pérez"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            placeholder="ejemplo@correo.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Teléfono *
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            placeholder="+593 987 654 321"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cédula *
          </label>
          <input
            type="text"
            required
            value={formData.cedula}
            onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            placeholder="Ej: 1712345678"
          />
          <p className="mt-1 text-xs text-gray-500">
            Número de cédula de identidad
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID de Documento de Cédula (PDF)
          </label>
          <input
            type="text"
            value={formData.cedulaDocumentId}
            onChange={(e) => setFormData({ ...formData, cedulaDocumentId: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            placeholder="ID del documento PDF subido"
          />
          <p className="mt-1 text-xs text-gray-500">
            ID del documento PDF que será subido para verificación
          </p>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Creando perfil...' : 'Crear perfil'}
          </Button>
        </div>
      </form>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-2">
          📋 ¿Por qué necesito un perfil?
        </h3>
        <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
          <li>Para alquilar artículos en la plataforma</li>
          <li>Para recibir enlaces de reseña por WhatsApp</li>
          <li>Para verificar tu identidad con cédula</li>
          <li>Para que los listers puedan contactarte</li>
        </ul>
      </div>
    </div>
  )
}

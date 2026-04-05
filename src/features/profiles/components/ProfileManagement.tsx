'use client'

import { useState, useEffect, useCallback } from 'react'
import type { UserProfile } from '@/shared/types/user-profile'
import { obtenerPerfilesPorEstado, actualizarPerfil } from '@/features/profiles/services/profile-service'
import { etiquetasEstadoPerfil } from '@/lib/dominio/estados-perfil'
import Button from '@/shared/components/ui/Button'
import Badge from '@/shared/components/ui/Badge'

export default function ProfileManagement() {
  const [profiles, setProfiles] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'pending' | 'approved' | 'all'>('pending')

  const loadProfiles = useCallback(async () => {
    try {
      setLoading(true)
      if (filter === 'all') {
        // For now, just load pending profiles
        // In a real implementation, you'd load all profiles
        const pendingProfiles = await obtenerPerfilesPorEstado('pending')
        setProfiles(pendingProfiles)
      } else {
        const filteredProfiles = await obtenerPerfilesPorEstado(filter)
        setProfiles(filteredProfiles)
      }
    } catch (error) {
      console.error('Error loading profiles:', error)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    loadProfiles()
  }, [filter, loadProfiles])

  const handleApprove = async (profileId: string) => {
    try {
      await actualizarPerfil(profileId, { status: 'approved' })
      await loadProfiles()
    } catch (error) {
      console.error('Error approving profile:', error)
    }
  }

  const handleReject = async (profileId: string) => {
    try {
      await actualizarPerfil(profileId, { status: 'rejected' })
      await loadProfiles()
    } catch (error) {
      console.error('Error rejecting profile:', error)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Gestión de Perfiles
        </h1>
        
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === 'pending' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('pending')}
          >
            Pendientes ({profiles.length})
          </Button>
          <Button
            variant={filter === 'approved' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('approved')}
          >
            Aprobados
          </Button>
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Todos
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Cargando perfiles...</p>
        </div>
      ) : profiles.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No hay perfiles {filter === 'pending' ? 'pendientes' : 'aprobados'} por revisar
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {profile.firstName} {profile.lastName}
                    </h3>
                    <Badge variant="default">
                      {etiquetasEstadoPerfil[profile.status]}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <strong>Email:</strong> {profile.email}
                    </div>
                    <div>
                      <strong>Teléfono:</strong> {profile.phone}
                    </div>
                    <div>
                      <strong>Cédula:</strong> {profile.cedula || 'No proporcionada'}
                    </div>
                    <div>
                      <strong>ID Documento:</strong> {profile.cedulaDocumentId || 'No subido'}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-2">
                    Creado: {profile.createdAt.toLocaleDateString()}
                  </div>
                </div>
                
                {profile.status === 'pending' && (
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(profile.id)}
                    >
                      Aprobar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(profile.id)}
                    >
                      Rechazar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

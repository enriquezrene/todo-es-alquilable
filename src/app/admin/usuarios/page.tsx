'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/shared/providers/AuthProvider'
import { useToast } from '@/shared/providers/ToastProvider'
import { obtenerUsuarios, cambiarRolUsuario } from '@/features/admin/services/user-admin-service'
import type { Usuario, RolUsuario } from '@/shared/types/usuario'
import { formatearFecha } from '@/lib/dominio/formatear-fecha'
import Select from '@/shared/components/ui/Select'
import Spinner from '@/shared/components/ui/Spinner'
import { registrarError } from '@/lib/registrar-error'
import Badge from '@/shared/components/ui/Badge'

const roleOptions = [
  { value: 'user', label: 'Usuario' },
  { value: 'moderator', label: 'Moderador' },
  { value: 'admin', label: 'Admin' },
  { value: 'super_admin', label: 'Super Admin' },
]

export default function UsuariosAdminPage() {
  const { role } = useAuth()
  const { mostrarToast } = useToast()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)

  const isSuperAdmin = role === 'super_admin'

  useEffect(() => {
    async function cargar() {
      try {
        const data = await obtenerUsuarios()
        setUsuarios(data)
      } catch (e) {
        registrarError(e, 'UsuariosPage:cargar')
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  const handleRoleChange = async (uid: string, newRole: RolUsuario) => {
    try {
      await cambiarRolUsuario(uid, newRole)
      setUsuarios((prev) => prev.map((u) => (u.uid === uid ? { ...u, role: newRole } : u)))
      mostrarToast('Rol actualizado', 'success')
    } catch (e) {
      registrarError(e, 'UsuariosPage:cambiar-rol')
      mostrarToast('Error al cambiar el rol', 'error')
    }
  }

  if (loading) return <Spinner size="lg" />

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Gestión de usuarios</h1>

      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Provincia</th>
              <th className="px-4 py-3 font-medium">Anuncios</th>
              <th className="px-4 py-3 font-medium">Rol</th>
              <th className="px-4 py-3 font-medium">Registro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {usuarios.map((u) => (
              <tr key={u.uid}>
                <td className="px-4 py-3 font-medium">{u.displayName}</td>
                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                <td className="px-4 py-3">{u.province}</td>
                <td className="px-4 py-3">{u.activeListingCount}</td>
                <td className="px-4 py-3">
                  {isSuperAdmin ? (
                    <Select
                      options={roleOptions}
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.uid, e.target.value as RolUsuario)}
                    />
                  ) : (
                    <Badge>{u.role}</Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500">{formatearFecha(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useToast } from '@/shared/providers/ToastProvider'
import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from '@/features/admin/services/category-admin-service'
import type { Categoria } from '@/shared/types/categoria'
import Button from '@/shared/components/ui/Button'
import Input from '@/shared/components/ui/Input'
import { registrarError } from '@/lib/registrar-error'
import Spinner from '@/shared/components/ui/Spinner'

export default function CategoriasAdminPage() {
  const { mostrarToast } = useToast()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState('')

  useEffect(() => {
    async function cargar() {
      try {
        const data = await obtenerCategorias()
        setCategorias(data)
      } catch (e) {
        registrarError(e, 'CategoriasPage:cargar')
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  const handleCreate = async () => {
    if (!newName.trim() || !newIcon.trim()) return
    try {
      await crearCategoria(newName.trim(), newIcon.trim())
      mostrarToast('Categoría creada', 'success')
      setNewName('')
      setNewIcon('')
      const data = await obtenerCategorias()
      setCategorias(data)
    } catch (e) {
      registrarError(e, 'CategoriasPage:crear')
      mostrarToast('Error al crear la categoría', 'error')
    }
  }

  const handleToggle = async (cat: Categoria) => {
    try {
      await actualizarCategoria(cat.id, { isActive: !cat.isActive })
      setCategorias((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, isActive: !c.isActive } : c)),
      )
    } catch (e) {
      registrarError(e, 'CategoriasPage:toggle')
      mostrarToast('Error al actualizar la categoría', 'error')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await eliminarCategoria(id)
      setCategorias((prev) => prev.filter((c) => c.id !== id))
      mostrarToast('Categoría eliminada', 'info')
    } catch (e) {
      registrarError(e, 'CategoriasPage:eliminar')
      mostrarToast('Error al eliminar la categoría', 'error')
    }
  }

  if (loading) return <Spinner size="lg" />

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Gestión de categorías</h1>

      <div className="mb-6 flex gap-2">
        <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nombre" />
        <Input value={newIcon} onChange={(e) => setNewIcon(e.target.value)} placeholder="Icono (emoji)" className="w-24" />
        <Button onClick={handleCreate}>Agregar</Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium">Icono</th>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Anuncios</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categorias.map((cat) => (
              <tr key={cat.id}>
                <td className="px-4 py-3 text-lg">{cat.icon}</td>
                <td className="px-4 py-3">{cat.name}</td>
                <td className="px-4 py-3">{cat.listingCount}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium ${cat.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                    {cat.isActive ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleToggle(cat)}>
                      {cat.isActive ? 'Desactivar' : 'Activar'}
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(cat.id)}>
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

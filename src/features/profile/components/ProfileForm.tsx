'use client'

import { useState, useMemo, useEffect } from 'react'
import { useAuth } from '@/shared/providers/AuthProvider'
import { useToast } from '@/shared/providers/ToastProvider'
import { obtenerPerfil, actualizarPerfil } from '@/features/profile/services/profile-service'
import { formatearTelefonoEcuador } from '@/lib/dominio/validar-telefono-ecuador'
import { obtenerNombresProvincias, obtenerCiudadesPorProvincia } from '@/lib/dominio/provincias-ecuador'
import type { FormularioPerfil } from '../types'
import Input from '@/shared/components/ui/Input'
import Select from '@/shared/components/ui/Select'
import Button from '@/shared/components/ui/Button'
import Spinner from '@/shared/components/ui/Spinner'

export default function ProfileForm() {
  const { user } = useAuth()
  const { mostrarToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [datos, setDatos] = useState<FormularioPerfil>({
    displayName: '',
    phone: '',
    province: '',
    city: '',
    address: '',
  })

  const provincias = useMemo(
    () => obtenerNombresProvincias().map((p) => ({ value: p, label: p })),
    [],
  )

  const ciudades = useMemo(
    () =>
      datos.province
        ? obtenerCiudadesPorProvincia(datos.province).map((c) => ({ value: c, label: c }))
        : [],
    [datos.province],
  )

  useEffect(() => {
    if (!user) return

    async function cargar() {
      const perfil = await obtenerPerfil(user!.uid)
      if (perfil) {
        setDatos({
          displayName: perfil.displayName,
          phone: perfil.phone,
          province: perfil.province,
          city: perfil.city,
          address: perfil.address,
        })
      }
      setLoading(false)
    }
    cargar()
  }, [user])

  const handleChange = (field: keyof FormularioPerfil) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.value
    setDatos((prev) => {
      const updated = { ...prev, [field]: value }
      if (field === 'province') updated.city = ''
      return updated
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    try {
      await actualizarPerfil(user.uid, {
        ...datos,
        phone: formatearTelefonoEcuador(datos.phone),
      })
      mostrarToast('Perfil actualizado', 'success')
    } catch {
      mostrarToast('Error al actualizar el perfil', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Nombre" value={datos.displayName} onChange={handleChange('displayName')} />
      <Input label="Teléfono" value={datos.phone} onChange={handleChange('phone')} placeholder="+593991234567" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="Provincia" options={provincias} value={datos.province} onChange={handleChange('province')} placeholder="Selecciona" />
        <Select label="Ciudad" options={ciudades} value={datos.city} onChange={handleChange('city')} placeholder="Selecciona" disabled={!datos.province} />
      </div>
      <Input label="Dirección" value={datos.address} onChange={handleChange('address')} />
      <Button type="submit" loading={saving}>
        Guardar cambios
      </Button>
    </form>
  )
}

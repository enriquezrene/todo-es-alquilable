'use client'

import { useState, useMemo, useEffect } from 'react'
import { useAuth } from '@/shared/providers/AuthProvider'
import { useToast } from '@/shared/providers/ToastProvider'
import { obtenerPerfil, actualizarPerfil } from '@/features/profile/services/profile-service'
import { validarFormularioPerfil } from '@/features/profile/services/validar-formulario-perfil'
import { formatearTelefonoEcuador } from '@/lib/dominio/validar-telefono-ecuador'
import { obtenerNombresProvincias, obtenerCiudadesPorProvincia } from '@/lib/dominio/provincias-ecuador'
import type { FormularioPerfil, ErroresFormulario } from '../types'
import type { Ubicacion } from '@/shared/types/location'
import { registrarError } from '@/lib/registrar-error'
import Input from '@/shared/components/ui/Input'
import Select from '@/shared/components/ui/Select'
import Button from '@/shared/components/ui/Button'
import Spinner from '@/shared/components/ui/Spinner'
import LocationSelector from './LocationSelector'

export default function ProfileForm() {
  const { user } = useAuth()
  const { mostrarToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errores, setErrores] = useState<ErroresFormulario>({})
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
      try {
        const perfil = await obtenerPerfil(user!.uid)
        if (perfil) {
          setDatos({
            displayName: perfil.displayName,
            phone: formatearTelefonoEcuador(perfil.phone),
            province: perfil.province,
            city: perfil.city,
            address: perfil.address,
            ubicacion: perfil.ubicacion,
          })
        }
      } catch (e) {
        registrarError(e, 'ProfileForm:cargar')
      } finally {
        setLoading(false)
      }
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
    setErrores((prev) => ({ ...prev, [field]: '' }))
  }

  const handleLocationChange = (ubicacion: Ubicacion | null) => {
    setDatos((prev) => ({ ...prev, ubicacion: ubicacion || undefined }))
    setErrores((prev) => ({ ...prev, ubicacion: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const nuevosErrores = validarFormularioPerfil(datos)
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      return
    }

    setSaving(true)
    try {
      await actualizarPerfil(user.uid, {
        ...datos,
        phone: formatearTelefonoEcuador(datos.phone),
      })
      mostrarToast('Perfil actualizado', 'success')
    } catch (error) {
      registrarError(error, 'ProfileForm:actualizar')
      mostrarToast('Error al actualizar el perfil', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input 
          label="Nombre" 
          value={datos.displayName} 
          onChange={handleChange('displayName')} 
          error={errores.displayName}
        />
        <Input 
          label="Teléfono" 
          value={datos.phone} 
          onChange={handleChange('phone')} 
          error={errores.phone}
          placeholder="0999999999" 
          required
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select 
            label="Provincia" 
            options={provincias} 
            value={datos.province} 
            onChange={handleChange('province')} 
            placeholder="Selecciona" 
            error={errores.province}
          />
          <Select 
            label="Ciudad" 
            options={ciudades} 
            value={datos.city} 
            onChange={handleChange('city')} 
            placeholder="Selecciona" 
            disabled={!datos.province}
            error={errores.city}
          />
        </div>
        <Input 
          label="Dirección" 
          value={datos.address} 
          onChange={handleChange('address')} 
          error={errores.address}
          required
        />
      </div>

      <div className="border-t pt-6">
        <LocationSelector
          onLocationChange={handleLocationChange}
          initialLocation={datos.ubicacion}
          error={errores.ubicacion}
        />
      </div>

      <Button type="submit" loading={saving}>
        Guardar cambios
      </Button>
    </form>
  )
}

'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { registrarUsuario } from '@/features/auth/services/auth-service'
import { validarFormularioRegistro } from '@/features/auth/services/validar-formulario-auth'
import { formatearTelefonoEcuador } from '@/lib/dominio/validar-telefono-ecuador'
import { obtenerNombresProvincias, obtenerCiudadesPorProvincia } from '@/lib/dominio/provincias-ecuador'
import type { FormularioRegistro, ErroresFormulario } from '@/features/auth/types'
import Button from '@/shared/components/ui/Button'
import Input from '@/shared/components/ui/Input'
import Select from '@/shared/components/ui/Select'
import { useToast } from '@/shared/providers/ToastProvider'
import { registrarError } from '@/lib/registrar-error'

export default function RegisterForm() {
  const router = useRouter()
  const { mostrarToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [errores, setErrores] = useState<ErroresFormulario>({})
  const [datos, setDatos] = useState<FormularioRegistro>({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    phone: '+593',
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

  const handleChange = (field: keyof FormularioRegistro) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.value
    setDatos((prev) => {
      const updated = { ...prev, [field]: value }
      if (field === 'province') updated.city = ''
      return updated
    })
    setErrores((prev) => ({ ...prev, [field]: '' }))
  }

  const handlePhoneBlur = () => {
    setDatos((prev) => ({ ...prev, phone: formatearTelefonoEcuador(prev.phone) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const nuevosErrores = validarFormularioRegistro(datos)
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      return
    }

    setLoading(true)
    try {
      await registrarUsuario(datos)
      mostrarToast('Cuenta creada exitosamente', 'success')
      router.push('/')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al crear la cuenta'
      if (message.includes('email-already-in-use')) {
        mostrarToast('Este email ya está registrado', 'error')
      } else {
        registrarError(error, 'RegisterForm:registrar')
        mostrarToast(message, 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nombre completo"
        value={datos.displayName}
        onChange={handleChange('displayName')}
        error={errores.displayName}
        placeholder="Juan Pérez"
      />
      <Input
        label="Email"
        type="email"
        value={datos.email}
        onChange={handleChange('email')}
        error={errores.email}
        placeholder="tu@email.com"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Contraseña"
          type="password"
          value={datos.password}
          onChange={handleChange('password')}
          error={errores.password}
          placeholder="Mínimo 6 caracteres"
        />
        <Input
          label="Confirmar contraseña"
          type="password"
          value={datos.confirmPassword}
          onChange={handleChange('confirmPassword')}
          error={errores.confirmPassword}
          placeholder="Repite la contraseña"
        />
      </div>
      <Input
        label="Teléfono"
        value={datos.phone}
        onChange={handleChange('phone')}
        onBlur={handlePhoneBlur}
        error={errores.phone}
        placeholder="+593991234567"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Provincia"
          options={provincias}
          value={datos.province}
          onChange={handleChange('province')}
          error={errores.province}
          placeholder="Selecciona provincia"
        />
        <Select
          label="Ciudad"
          options={ciudades}
          value={datos.city}
          onChange={handleChange('city')}
          error={errores.city}
          placeholder="Selecciona ciudad"
          disabled={!datos.province}
        />
      </div>
      <Input
        label="Dirección"
        value={datos.address}
        onChange={handleChange('address')}
        error={errores.address}
        placeholder="Av. Principal 123, Sector Norte"
      />
      <Button type="submit" loading={loading} className="w-full">
        Crear cuenta
      </Button>
      <p className="text-center text-sm text-gray-600">
        ¿Ya tienes cuenta?{' '}
        <Link href="/iniciar-sesion" className="font-medium text-blue-600 hover:text-blue-500">
          Inicia sesión
        </Link>
      </p>
    </form>
  )
}

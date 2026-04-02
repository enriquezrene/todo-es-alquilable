'use client'

import { useState } from 'react'
import Link from 'next/link'
import { enviarEmailRecuperacion } from '@/features/auth/services/recuperar-contrasena-service'
import type { FormularioRecuperarContrasena, ErroresFormulario } from '@/features/auth/types'
import Button from '@/shared/components/ui/Button'
import Input from '@/shared/components/ui/Input'
import { useToast } from '@/shared/providers/ToastProvider'
import { registrarError } from '@/lib/registrar-error'

export default function RecuperarContrasenaForm() {
  const { mostrarToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [errores, setErrores] = useState<ErroresFormulario>({})
  const [datos, setDatos] = useState<FormularioRecuperarContrasena>({
    email: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setDatos({ email: value })
    setErrores((prev) => ({ ...prev, email: '' }))
  }

  const validarFormulario = (): ErroresFormulario => {
    const nuevosErrores: ErroresFormulario = {}

    if (!datos.email.trim()) {
      nuevosErrores.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) {
      nuevosErrores.email = 'El email no es válido'
    }

    return nuevosErrores
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const nuevosErrores = validarFormulario()
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      return
    }

    setLoading(true)
    try {
      await enviarEmailRecuperacion(datos.email)
      mostrarToast('Email de recuperación enviado correctamente', 'success')
      window.location.href = '/recuperar-contrasena/exito'
    } catch (error) {
      registrarError(error, 'RecuperarContrasenaForm:enviar-recuperacion')
      mostrarToast('Error al enviar el email de recuperación', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input
        label="Email"
        type="email"
        value={datos.email}
        onChange={handleChange}
        error={errores.email}
        placeholder="tu@email.com"
      />
      <Button type="submit" loading={loading} className="w-full">
        Enviar email de recuperación
      </Button>
      <p className="text-center text-sm text-gray-600">
        <Link href="/iniciar-sesion" className="font-medium text-blue-600 hover:text-blue-500">
          Volver a iniciar sesión
        </Link>
      </p>
    </form>
  )
}

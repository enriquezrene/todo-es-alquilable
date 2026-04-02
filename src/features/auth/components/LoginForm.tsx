'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { iniciarSesion } from '@/features/auth/services/auth-service'
import { validarFormularioLogin } from '@/features/auth/services/validar-formulario-auth'
import type { FormularioLogin, ErroresFormulario } from '@/features/auth/types'
import Button from '@/shared/components/ui/Button'
import Input from '@/shared/components/ui/Input'
import { useToast } from '@/shared/providers/ToastProvider'
import { registrarError } from '@/lib/registrar-error'

export default function LoginForm() {
  const router = useRouter()
  const { mostrarToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [errores, setErrores] = useState<ErroresFormulario>({})
  const [datos, setDatos] = useState<FormularioLogin>({
    email: '',
    password: '',
  })

  const handleChange = (field: keyof FormularioLogin) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatos((prev) => ({ ...prev, [field]: e.target.value }))
    setErrores((prev) => ({ ...prev, [field]: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const nuevosErrores = validarFormularioLogin(datos)
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      return
    }

    setLoading(true)
    try {
      await iniciarSesion(datos.email, datos.password)
      mostrarToast('Sesión iniciada correctamente', 'success')
      router.push('/')
    } catch (error) {
      registrarError(error, 'LoginForm:iniciar-sesion')
      mostrarToast('Email o contraseña incorrectos', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        value={datos.email}
        onChange={handleChange('email')}
        error={errores.email}
        placeholder="tu@email.com"
      />
      <Input
        label="Contraseña"
        type="password"
        value={datos.password}
        onChange={handleChange('password')}
        error={errores.password}
        placeholder="Tu contraseña"
      />
      <Button type="submit" loading={loading} className="w-full">
        Iniciar sesión
      </Button>
      <div className="space-y-2 text-center text-sm">
        <Link href="/recuperar-contrasena" className="font-medium text-blue-600 hover:text-blue-500">
          ¿Olvidaste tu contraseña?
        </Link>
        <p className="text-gray-600">
          ¿No tienes cuenta?{' '}
          <Link href="/registrarse" className="font-medium text-blue-600 hover:text-blue-500">
            Regístrate
          </Link>
        </p>
      </div>
    </form>
  )
}

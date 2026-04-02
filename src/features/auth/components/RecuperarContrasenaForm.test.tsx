import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RecuperarContrasenaForm from './RecuperarContrasenaForm'
import { enviarEmailRecuperacion } from '@/features/auth/services/recuperar-contrasena-service'
import { useToast } from '@/shared/providers/ToastProvider'
import { registrarError } from '@/lib/registrar-error'

vi.mock('@/features/auth/services/recuperar-contrasena-service')
vi.mock('@/shared/providers/ToastProvider')
vi.mock('@/lib/registrar-error')
vi.mock('next/router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

describe('RecuperarContrasenaForm', () => {
  const mockMostrarToast = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useToast).mockReturnValue({
      mostrarToast: mockMostrarToast,
      toast: null,
      setToast: vi.fn(),
    })
  })

  it('debe renderizar el formulario correctamente', () => {
    render(<RecuperarContrasenaForm />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /enviar email de recuperación/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /volver a iniciar sesión/i })).toBeInTheDocument()
  })

  it('debe mostrar error de validación cuando el email está vacío', async () => {
    const user = userEvent.setup()
    render(<RecuperarContrasenaForm />)
    
    const submitButton = screen.getByRole('button', { name: /enviar email de recuperación/i })
    await user.click(submitButton)
    
    expect(screen.getByText('El email es requerido')).toBeInTheDocument()
  })

  it('debe mostrar error de validación cuando el email no es válido', async () => {
    const user = userEvent.setup()
    render(<RecuperarContrasenaForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /enviar email de recuperación/i })
    
    // Clear the input first, then type invalid email
    await user.clear(emailInput)
    await user.type(emailInput, 'email-invalido')
    await user.click(submitButton)
    
    expect(screen.getByText('El email no es válido')).toBeInTheDocument()
  })

  it('debe enviar el formulario correctamente', async () => {
    const user = userEvent.setup()
    vi.mocked(enviarEmailRecuperacion).mockResolvedValue(undefined)
    
    // Mock window.location.href
    const originalLocation = window.location
    delete window.location
    window.location = { ...originalLocation, href: '' }
    
    render(<RecuperarContrasenaForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /enviar email de recuperación/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(enviarEmailRecuperacion).toHaveBeenCalledWith('test@example.com')
      expect(mockMostrarToast).toHaveBeenCalledWith('Email de recuperación enviado correctamente', 'success')
      expect(window.location.href).toBe('/recuperar-contrasena/exito')
    })
    
    // Restore original location
    window.location = originalLocation
  })

  it('debe manejar errores al enviar el email', async () => {
    const user = userEvent.setup()
    const error = new Error('Error al enviar email')
    vi.mocked(enviarEmailRecuperacion).mockRejectedValue(error)
    
    render(<RecuperarContrasenaForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /enviar email de recuperación/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockMostrarToast).toHaveBeenCalledWith('Error al enviar el email de recuperación', 'error')
      expect(registrarError).toHaveBeenCalledWith(error, 'RecuperarContrasenaForm:enviar-recuperacion')
    })
  })

  it('debe limpiar errores al escribir en el campo email', async () => {
    const user = userEvent.setup()
    render(<RecuperarContrasenaForm />)
    
    const submitButton = screen.getByRole('button', { name: /enviar email de recuperación/i })
    const emailInput = screen.getByLabelText(/email/i)
    
    // Trigger validation error
    await user.click(submitButton)
    expect(screen.getByText('El email es requerido')).toBeInTheDocument()
    
    // Type in email field
    await user.type(emailInput, 'test@example.com')
    expect(screen.queryByText('El email es requerido')).not.toBeInTheDocument()
  })
})

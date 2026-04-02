import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import PasswordResetActionPage from './page'
import { useSearchParams, useRouter } from 'next/navigation'
import { checkActionCode } from 'firebase/auth'

// Mock Next.js hooks
vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
  useRouter: vi.fn(),
}))

// Mock Firebase
vi.mock('@/lib/firebase/firebase-config', () => ({
  getAuthInstance: vi.fn(),
}))

vi.mock('firebase/auth', () => ({
  checkActionCode: vi.fn(),
  applyActionCode: vi.fn(),
}))

describe('PasswordResetActionPage', () => {
  const mockPush = vi.fn()
  const mockSearchParams = new URLSearchParams()

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset search params to empty state
    mockSearchParams.delete('oobCode')
    mockSearchParams.delete('mode')
    
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    })
    vi.mocked(useSearchParams).mockReturnValue(mockSearchParams)
  })

  it('debe mostrar loading inicialmente', async () => {
    // Set up valid params to avoid immediate error
    mockSearchParams.set('oobCode', 'test-code')
    mockSearchParams.set('mode', 'resetPassword')
    
    render(<PasswordResetActionPage />)
    
    // Should show loading initially
    expect(screen.getByText('Procesando...')).toBeInTheDocument()
  })

  it('debe mostrar error cuando no hay código o modo inválido', async () => {
    mockSearchParams.delete('oobCode')
    mockSearchParams.set('mode', 'invalid')
    
    render(<PasswordResetActionPage />)
    
    const errorElement = await screen.findByText('Enlace inválido o expirado')
    expect(errorElement).toBeInTheDocument()
  })

  it('debe mostrar error cuando el código es inválido', async () => {
    mockSearchParams.set('oobCode', 'invalid-code')
    mockSearchParams.set('mode', 'resetPassword')
    
    vi.mocked(checkActionCode).mockRejectedValue(new Error('Invalid code'))
    
    render(<PasswordResetActionPage />)
    
    const errorElement = await screen.findByText('El enlace para restablecer contraseña es inválido o ha expirado')
    expect(errorElement).toBeInTheDocument()
  })

  it('debe mostrar éxito cuando el código es válido', async () => {
    mockSearchParams.set('oobCode', 'valid-code')
    mockSearchParams.set('mode', 'resetPassword')
    
    vi.mocked(checkActionCode).mockResolvedValue(undefined)
    
    render(<PasswordResetActionPage />)
    
    const successElement = await screen.findByText('¡Contraseña restablecida!')
    expect(successElement).toBeInTheDocument()
    expect(screen.getByText('Iniciar sesión ahora')).toBeInTheDocument()
  })

  it('debe redirigir a recuperación de contraseña cuando hay error', async () => {
    mockSearchParams.set('oobCode', 'invalid-code')
    mockSearchParams.set('mode', 'resetPassword')
    
    vi.mocked(checkActionCode).mockRejectedValue(new Error('Invalid code'))
    
    render(<PasswordResetActionPage />)
    
    const solicitarButton = await screen.findByText('Solicitar nuevo email')
    await solicitarButton.click()
    
    expect(mockPush).toHaveBeenCalledWith('/recuperar-contrasena')
  })

  it('debe redirigir a inicio de sesión cuando hay éxito', async () => {
    mockSearchParams.set('oobCode', 'valid-code')
    mockSearchParams.set('mode', 'resetPassword')
    
    vi.mocked(checkActionCode).mockResolvedValue(undefined)
    
    render(<PasswordResetActionPage />)
    
    const loginButton = await screen.findByText('Iniciar sesión ahora')
    await loginButton.click()
    
    expect(mockPush).toHaveBeenCalledWith('/iniciar-sesion')
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import RecuperarContrasenaCompletado from './RecuperarContrasenaCompletado'

describe('RecuperarContrasenaCompletado', () => {
  it('debe renderizar el mensaje de éxito correctamente', () => {
    render(<RecuperarContrasenaCompletado />)
    
    expect(screen.getByText('¡Contraseña restablecida!')).toBeInTheDocument()
    expect(screen.getByText('Tu contraseña ha sido actualizada exitosamente.')).toBeInTheDocument()
    expect(screen.getByText('Ahora puedes iniciar sesión con tu nueva contraseña.')).toBeInTheDocument()
  })

  it('debe mostrar el botón para iniciar sesión', () => {
    render(<RecuperarContrasenaCompletado />)
    
    const loginButton = screen.getByRole('button', { name: /iniciar sesión ahora/i })
    expect(loginButton).toBeInTheDocument()
    expect(loginButton.closest('a')).toHaveAttribute('href', '/iniciar-sesion')
  })

  it('debe mostrar el ícono de éxito', () => {
    render(<RecuperarContrasenaCompletado />)
    
    const svgIcon = document.querySelector('svg')
    expect(svgIcon).toBeInTheDocument()
    expect(svgIcon?.parentElement).toHaveClass('bg-green-100')
  })
})

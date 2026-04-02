import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import RecuperarContrasenaExitoso from './RecuperarContrasenaExitoso'

describe('RecuperarContrasenaExitoso', () => {
  it('debe renderizar el mensaje de email enviado correctamente', () => {
    render(<RecuperarContrasenaExitoso />)
    
    expect(screen.getByText('Email enviado')).toBeInTheDocument()
    expect(screen.getByText('Hemos enviado un email con las instrucciones para recuperar tu contraseña.')).toBeInTheDocument()
    expect(screen.getByText(/haz clic en el enlace del email para crear tu nueva contraseña/i)).toBeInTheDocument()
  })

  it('debe mostrar el botón para volver a iniciar sesión', () => {
    render(<RecuperarContrasenaExitoso />)
    
    const loginButton = screen.getByRole('button', { name: /volver a iniciar sesión/i })
    expect(loginButton).toBeInTheDocument()
    expect(loginButton.closest('a')).toHaveAttribute('href', '/iniciar-sesion')
  })

  it('debe mostrar el enlace para reenviar email', () => {
    render(<RecuperarContrasenaExitoso />)
    
    const resendLink = screen.getByRole('button', { name: /reenviar email/i })
    expect(resendLink).toBeInTheDocument()
    expect(resendLink.closest('a')).toHaveAttribute('href', '/recuperar-contrasena')
  })

  it('debe mostrar el enlace para usuarios que ya restablecieron su contraseña', () => {
    render(<RecuperarContrasenaExitoso />)
    
    expect(screen.getByText(/¿ya restableciste tu contraseña\?/i)).toBeInTheDocument()
    const completedLink = screen.getByText('Ir a iniciar sesión')
    expect(completedLink).toBeInTheDocument()
    expect(completedLink.closest('a')).toHaveAttribute('href', '/recuperar-contrasena/completado')
  })

  it('debe mostrar el ícono de email', () => {
    render(<RecuperarContrasenaExitoso />)
    
    const svgIcon = document.querySelector('svg')
    expect(svgIcon).toBeInTheDocument()
    expect(svgIcon?.parentElement).toHaveClass('bg-green-100')
  })
})

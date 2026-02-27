import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Input from './Input'

describe('Input', () => {
  it('renderiza con label', () => {
    render(<Input label="Email" />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('muestra error', () => {
    render(<Input label="Email" error="Campo requerido" />)
    expect(screen.getByText('Campo requerido')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('marca aria-invalid cuando hay error', () => {
    render(<Input label="Email" error="Error" />)
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
  })

  it('permite escribir texto', async () => {
    render(<Input label="Nombre" />)
    const input = screen.getByLabelText('Nombre')
    await userEvent.type(input, 'Juan')
    expect(input).toHaveValue('Juan')
  })

  it('renderiza sin label', () => {
    render(<Input placeholder="Escribe aquí" />)
    expect(screen.getByPlaceholderText('Escribe aquí')).toBeInTheDocument()
  })
})

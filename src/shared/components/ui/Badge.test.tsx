import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Badge from './Badge'

describe('Badge', () => {
  it('renderiza texto', () => {
    render(<Badge>Aprobado</Badge>)
    expect(screen.getByText('Aprobado')).toBeInTheDocument()
  })

  it('aplica variante success', () => {
    render(<Badge variant="success">Activo</Badge>)
    expect(screen.getByText('Activo')).toHaveClass('bg-green-100')
  })

  it('aplica variante error', () => {
    render(<Badge variant="error">Rechazado</Badge>)
    expect(screen.getByText('Rechazado')).toHaveClass('bg-red-100')
  })

  it('aplica variante default', () => {
    render(<Badge>Normal</Badge>)
    expect(screen.getByText('Normal')).toHaveClass('bg-gray-100')
  })
})

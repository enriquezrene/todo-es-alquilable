import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import EmptyState from './EmptyState'

describe('EmptyState', () => {
  it('renderiza título', () => {
    render(<EmptyState title="No hay anuncios" />)
    expect(screen.getByText('No hay anuncios')).toBeInTheDocument()
  })

  it('renderiza descripción', () => {
    render(<EmptyState title="Vacío" description="Publica tu primer anuncio" />)
    expect(screen.getByText('Publica tu primer anuncio')).toBeInTheDocument()
  })

  it('renderiza acción', () => {
    render(<EmptyState title="Vacío" action={<button>Publicar</button>} />)
    expect(screen.getByRole('button', { name: 'Publicar' })).toBeInTheDocument()
  })
})

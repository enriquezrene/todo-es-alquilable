import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ComoFuncionaPage from './page'

vi.mock('@/features/listings/components/OrdenDeTrabajoButton', () => ({
  default: () => <button type="button">Descargar Orden de Trabajo</button>,
}))

describe('ComoFuncionaPage', () => {
  it('muestra el contenido principal sobre seguridad y firma del PDF', () => {
    render(<ComoFuncionaPage />)

    expect(screen.getByRole('heading', { name: /¿Cómo funciona Todo es Alquilable\?/i })).toBeInTheDocument()
    expect(screen.getByText(/orden de trabajo en PDF que ambas partes pueden firmar/i)).toBeInTheDocument()
    expect(screen.getByText(/cada transacción queda mejor cubierta/i)).toBeInTheDocument()
  })

  it('muestra accesos para descargar el PDF y explorar artículos', () => {
    render(<ComoFuncionaPage />)

    expect(screen.getByRole('button', { name: /descargar orden de trabajo/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /explorar artículos/i })).toHaveAttribute('href', '/buscar')
  })
})

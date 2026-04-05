import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OrdenDeTrabajoButton from './OrdenDeTrabajoButton'
import { descargarOrdenDeTrabajo } from '../services/orden-de-trabajo-service'
import { registrarError } from '@/lib/registrar-error'

// Mock the Button component to avoid import issues
vi.mock('@/shared/components/ui/Button', () => {
  return {
    default: ({ children, onClick, disabled, className }: any) => (
      <button 
        onClick={onClick} 
        disabled={disabled} 
        className={className}
        data-testid="button"
      >
        {children}
      </button>
    ),
  }
})

// Mock dependencies
vi.mock('../services/orden-de-trabajo-service')
vi.mock('@/lib/registrar-error')

const mockDescargarOrdenDeTrabajo = vi.mocked(descargarOrdenDeTrabajo)

describe('OrdenDeTrabajoButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders button with correct text', () => {
    render(<OrdenDeTrabajoButton />)
    
    expect(screen.getByRole('button', { name: /descargar orden de trabajo/i })).toBeInTheDocument()
  })

  it('shows loading state when downloading', async () => {
    const user = userEvent.setup()
    mockDescargarOrdenDeTrabajo.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    render(<OrdenDeTrabajoButton />)
    
    const button = screen.getByRole('button', { name: /descargar orden de trabajo/i })
    await user.click(button)
    
    expect(screen.getByText('Descargando...')).toBeInTheDocument()
    expect(button).toBeDisabled()
  })

  it('calls descargarOrdenDeTrabajo when clicked', async () => {
    const user = userEvent.setup()
    mockDescargarOrdenDeTrabajo.mockResolvedValue(undefined)
    
    render(<OrdenDeTrabajoButton />)
    
    const button = screen.getByRole('button', { name: /descargar orden de trabajo/i })
    await user.click(button)
    
    expect(mockDescargarOrdenDeTrabajo).toHaveBeenCalled()
  })

  it('shows error message when download fails', async () => {
    const user = userEvent.setup()
    const errorMessage = 'Download failed'
    mockDescargarOrdenDeTrabajo.mockRejectedValue(new Error(errorMessage))
    
    render(<OrdenDeTrabajoButton />)
    
    const button = screen.getByRole('button', { name: /descargar orden de trabajo/i })
    await user.click(button)
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('logs error when download fails', async () => {
    const user = userEvent.setup()
    const error = new Error('Download failed')
    mockDescargarOrdenDeTrabajo.mockRejectedValue(error)
    
    render(<OrdenDeTrabajoButton />)
    
    const button = screen.getByRole('button', { name: /descargar orden de trabajo/i })
    await user.click(button)
    
    await waitFor(() => {
      expect(registrarError).toHaveBeenCalledWith(error, 'OrdenDeTrabajoButton:handleDownload')
    })
  })

  it('applies custom className', () => {
    render(<OrdenDeTrabajoButton className="custom-class" />)
    
    const container = screen.getByRole('button').parentElement
    expect(container).toHaveClass('custom-class')
  })

  it('renders with different variants', () => {
    const { rerender } = render(<OrdenDeTrabajoButton variant="secondary" />)
    expect(screen.getByRole('button')).toBeInTheDocument()
    
    rerender(<OrdenDeTrabajoButton variant="primary" />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<OrdenDeTrabajoButton size="sm" />)
    expect(screen.getByRole('button')).toBeInTheDocument()
    
    rerender(<OrdenDeTrabajoButton size="lg" />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('resets loading state after successful download', async () => {
    const user = userEvent.setup()
    mockDescargarOrdenDeTrabajo.mockResolvedValue(undefined)
    
    render(<OrdenDeTrabajoButton />)
    
    const button = screen.getByRole('button', { name: /descargar orden de trabajo/i })
    await user.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('Descargar Orden de Trabajo')).toBeInTheDocument()
    })
    expect(button).not.toBeDisabled()
  })
})

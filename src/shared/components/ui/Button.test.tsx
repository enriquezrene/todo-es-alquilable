import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './Button'

describe('Button', () => {
  it('renderiza con texto', () => {
    render(<Button>Publicar</Button>)
    expect(screen.getByRole('button', { name: 'Publicar' })).toBeInTheDocument()
  })

  it('ejecuta onClick', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('se desactiva cuando disabled', () => {
    render(<Button disabled>Desactivado</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('se desactiva cuando loading', () => {
    render(<Button loading>Cargando</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('muestra spinner cuando loading', () => {
    render(<Button loading>Enviar</Button>)
    const svg = screen.getByRole('button').querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('aplica variante outline', () => {
    render(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole('button')).toHaveClass('border')
  })

  it('aplica tamaño lg', () => {
    render(<Button size="lg">Grande</Button>)
    expect(screen.getByRole('button')).toHaveClass('px-6')
  })
})

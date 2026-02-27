import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Select from './Select'

const opciones = [
  { value: 'hora', label: 'Por hora' },
  { value: 'dia', label: 'Por día' },
  { value: 'mes', label: 'Por mes' },
]

describe('Select', () => {
  it('renderiza con opciones', () => {
    render(<Select label="Unidad" options={opciones} />)
    expect(screen.getByLabelText('Unidad')).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(3)
  })

  it('muestra placeholder', () => {
    render(<Select label="Unidad" options={opciones} placeholder="Selecciona..." defaultValue="" />)
    expect(screen.getByText('Selecciona...')).toBeInTheDocument()
  })

  it('muestra error', () => {
    render(<Select label="Unidad" options={opciones} error="Requerido" />)
    expect(screen.getByText('Requerido')).toBeInTheDocument()
  })

  it('permite seleccionar una opción', async () => {
    render(<Select label="Unidad" options={opciones} />)
    const select = screen.getByLabelText('Unidad')
    await userEvent.selectOptions(select, 'dia')
    expect(select).toHaveValue('dia')
  })
})

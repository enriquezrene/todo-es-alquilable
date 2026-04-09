import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ListingCard from './ListingCard'
import { crearAnuncioPrueba } from '@/test/mocks/datos-prueba'

describe('ListingCard', () => {
  it('muestra el título del anuncio', () => {
    const anuncio = crearAnuncioPrueba()
    render(<ListingCard anuncio={anuncio} />)
    expect(screen.getByText('Taladro eléctrico Bosch')).toBeInTheDocument()
  })

  it('muestra el precio formateado', () => {
    const anuncio = crearAnuncioPrueba({ price: 15, priceUnit: 'dia' })
    render(<ListingCard anuncio={anuncio} />)
    expect(screen.getByText(/15/)).toBeInTheDocument()
    expect(screen.getByText(/por día/)).toBeInTheDocument()
  })

  it('muestra la provincia', () => {
    const anuncio = crearAnuncioPrueba({ province: 'Pichincha' })
    render(<ListingCard anuncio={anuncio} />)
    expect(screen.getByText('Pichincha')).toBeInTheDocument()
  })

  it('muestra la ubicación aproximada cuando existe', () => {
    const anuncio = crearAnuncioPrueba({
      ubicacion: {
        coordenadas: { lat: -0.18, lng: -78.47 },
        direccion: {
          direccionCompleta: 'Quito, Pichincha, Ecuador',
          calle: '',
          ciudad: 'Quito',
          provincia: 'Pichincha',
          pais: 'Ecuador',
        },
        timestamp: new Date('2024-01-15'),
      },
    })

    render(<ListingCard anuncio={anuncio} />)

    expect(screen.getByText(/Ubicación aprox.: Quito, Pichincha/)).toBeInTheDocument()
  })

  it('muestra la categoría', () => {
    const anuncio = crearAnuncioPrueba({ categoryName: 'Herramientas' })
    render(<ListingCard anuncio={anuncio} />)
    expect(screen.getByText('Herramientas')).toBeInTheDocument()
  })

  it('tiene enlace al detalle', () => {
    const anuncio = crearAnuncioPrueba({ id: 'abc-123' })
    render(<ListingCard anuncio={anuncio} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/anuncio/abc-123')
  })
})

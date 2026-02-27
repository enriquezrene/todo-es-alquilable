import { describe, it, expect } from 'vitest'
import { construirEnlaceWhatsApp, construirMensajeAlquiler } from './construir-enlace-whatsapp'

describe('construirEnlaceWhatsApp', () => {
  it('construye enlace con teléfono y mensaje', () => {
    const enlace = construirEnlaceWhatsApp('+593991234567', 'Hola')
    expect(enlace).toBe('https://wa.me/593991234567?text=Hola')
  })

  it('limpia caracteres no numéricos del teléfono', () => {
    const enlace = construirEnlaceWhatsApp('+593 99 123-4567', 'Hola')
    expect(enlace).toBe('https://wa.me/593991234567?text=Hola')
  })

  it('codifica el mensaje para URL', () => {
    const enlace = construirEnlaceWhatsApp('+593991234567', 'Hola, me interesa')
    expect(enlace).toContain('Hola%2C%20me%20interesa')
  })
})

describe('construirMensajeAlquiler', () => {
  it('genera mensaje con el título del anuncio', () => {
    const mensaje = construirMensajeAlquiler('Taladro eléctrico')
    expect(mensaje).toContain('Taladro eléctrico')
    expect(mensaje).toContain('alquilar')
  })
})

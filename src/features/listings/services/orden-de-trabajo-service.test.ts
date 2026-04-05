import { describe, it, expect, vi, beforeEach } from 'vitest'
import { descargarOrdenDeTrabajo, obtenerOrdenDeTrabajo } from './orden-de-trabajo-service'
import { registrarError } from '@/lib/registrar-error'

// Mock dependencies
vi.mock('@/lib/registrar-error')
vi.mock('window', () => ({
  URL: {
    createObjectURL: vi.fn(() => 'mock-url'),
    revokeObjectURL: vi.fn(),
  },
}))

// Mock fetch
global.fetch = vi.fn()

describe('orden-de-trabajo-service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock document methods
    Object.defineProperty(document, 'createElement', {
      value: vi.fn(() => ({
        href: '',
        download: '',
        click: vi.fn(),
      })),
      writable: true,
    })
    Object.defineProperty(document, 'body', {
      value: {
        appendChild: vi.fn(),
        removeChild: vi.fn(),
      },
      writable: true,
    })
  })

  describe('descargarOrdenDeTrabajo', () => {
    it('should download PDF successfully', async () => {
      const mockBlob = new Blob(['test'], { type: 'application/pdf' })
      const mockResponse = {
        ok: true,
        blob: vi.fn().mockResolvedValue(mockBlob),
      }
      
      vi.mocked(fetch).mockResolvedValue(mockResponse as any)

      await descargarOrdenDeTrabajo()

      expect(fetch).toHaveBeenCalledWith('/orden-de-trabajo.pdf')
      expect(mockResponse.blob).toHaveBeenCalled()
      expect(document.createElement).toHaveBeenCalledWith('a')
    })

    it('should handle fetch error', async () => {
      const mockResponse = {
        ok: false,
        statusText: 'Not Found',
      }
      
      vi.mocked(fetch).mockResolvedValue(mockResponse as any)

      await expect(descargarOrdenDeTrabajo()).rejects.toThrow(
        'No se pudo descargar la orden de trabajo. Por favor, inténtalo de nuevo.'
      )

      expect(registrarError).toHaveBeenCalled()
    })

    it('should handle network error', async () => {
      const networkError = new Error('Network error')
      vi.mocked(fetch).mockRejectedValue(networkError)

      await expect(descargarOrdenDeTrabajo()).rejects.toThrow(
        'No se pudo descargar la orden de trabajo. Por favor, inténtalo de nuevo.'
      )

      expect(registrarError).toHaveBeenCalledWith(
        networkError,
        'OrdenDeTrabajoService:descargar'
      )
    })
  })

  describe('obtenerOrdenDeTrabajo', () => {
    it('should return orden de trabajo object', () => {
      const result = obtenerOrdenDeTrabajo()

      expect(result).toEqual({
        id: 'orden-de-trabajo-default',
        titulo: 'Orden de Trabajo',
        descripcion: 'Documento oficial para acuerdos de alquiler entre arrendador y arrendatario',
        urlPdf: '/orden-de-trabajo.pdf',
        fechaCreacion: expect.any(Date),
      })
    })

    it('should have correct URL', () => {
      const result = obtenerOrdenDeTrabajo()
      expect(result.urlPdf).toBe('/orden-de-trabajo.pdf')
    })
  })
})

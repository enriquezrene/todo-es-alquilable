import type { OrdenDeTrabajo } from '../types'
import { registrarError } from '@/lib/registrar-error'

const PDF_URL = '/orden-de-trabajo.pdf'

export async function descargarOrdenDeTrabajo(): Promise<void> {
  try {
    const response = await fetch(PDF_URL)
    
    if (!response.ok) {
      throw new Error(`Error al descargar el PDF: ${response.statusText}`)
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = 'orden-de-trabajo.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    window.URL.revokeObjectURL(url)
  } catch (error) {
    registrarError(error as Error, 'OrdenDeTrabajoService:descargar')
    throw new Error('No se pudo descargar la orden de trabajo. Por favor, inténtalo de nuevo.')
  }
}

export function obtenerOrdenDeTrabajo(): OrdenDeTrabajo {
  return {
    id: 'orden-de-trabajo-default',
    titulo: 'Orden de Trabajo',
    descripcion: 'Documento oficial para acuerdos de alquiler entre arrendador y arrendatario',
    urlPdf: PDF_URL,
    fechaCreacion: new Date()
  }
}

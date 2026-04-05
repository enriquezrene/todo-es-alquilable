import { construirEnlaceWhatsApp } from '@/lib/dominio/construir-enlace-whatsapp'
import type { Rental } from '@/shared/types/rental'

export function generarEnlaceReview(rental: Rental): string {
  const mensaje = `¡Hola ${rental.renterName}! 👋\n\nGracias por alquilar "${rental.listingId}". Nos encantaría conocer tu experiencia. ¿Podrías dejarnos una reseña?\n\nPuedes escribir tu reseña aquí: ${window?.location?.origin || 'https://todoesalquilable.com'}/anuncio/${rental.listingId}\n\n¡Gracias por tu confianza! 🎉`
  
  return construirEnlaceWhatsApp(rental.renterPhone, mensaje)
}

export function generarMensajeReview(renterName: string, listingTitle: string, listingId: string): string {
  return `¡Hola ${renterName}! 👋\n\nGracias por alquilar "${listingTitle}". Nos encantaría conocer tu experiencia. ¿Podrías dejarnos una reseña?\n\nPuedes escribir tu reseña aquí: ${window?.location?.origin || 'https://todoesalquilable.com'}/anuncio/${listingId}\n\n¡Gracias por tu confianza! 🎉`
}

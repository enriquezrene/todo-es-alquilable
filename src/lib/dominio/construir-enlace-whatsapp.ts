export function construirEnlaceWhatsApp(telefono: string, mensaje: string): string {
  // Keep + sign at the beginning, remove other formatting characters
  const telefonoLimpio = telefono.replace(/[^\+0-9]/g, '').replace(/^\+/, '+')
  const mensajeCodificado = encodeURIComponent(mensaje)
  return `https://wa.me/${telefonoLimpio}?text=${mensajeCodificado}`
}

export function construirMensajeAlquiler(tituloAnuncio: string): string {
  return `Hola, me interesa alquilar "${tituloAnuncio}". ¿Está disponible?`
}

export function construirMensajeRenta(
  tituloAnuncio: string,
  renterName: string,
  renterEmail: string,
  renterPhone: string,
  startDateTime: Date,
  endDateTime: Date,
  notes: string
): string {
  const formatoFecha = (date: Date) => {
    return new Intl.DateTimeFormat('es-EC', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  let mensaje = `🔔 *NUEVA SOLICITUD DE RENTA*\n\n`
  mensaje += `📦 *Artículo:* ${tituloAnuncio}\n`
  mensaje += `👤 *Solicitante:* ${renterName}\n`
  mensaje += `📧 *Email:* ${renterEmail}\n`
  mensaje += `📱 *Teléfono:* ${renterPhone}\n`
  mensaje += `📅 *Inicio:* ${formatoFecha(startDateTime)}\n`
  mensaje += `📅 *Fin:* ${formatoFecha(endDateTime)}\n`
  
  if (notes.trim()) {
    mensaje += `📝 *Notas:* ${notes}\n`
  }
  
  mensaje += `\nPor favor contacta al solicitante para confirmar la renta.`
  
  return mensaje
}

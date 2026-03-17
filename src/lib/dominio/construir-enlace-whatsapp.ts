export function construirEnlaceWhatsApp(telefono: string, mensaje: string): string {
  // Keep + sign at the beginning, remove other formatting characters
  const telefonoLimpio = telefono.replace(/[^\+0-9]/g, '').replace(/^\+/, '+')
  const mensajeCodificado = encodeURIComponent(mensaje)
  return `https://wa.me/${telefonoLimpio}?text=${mensajeCodificado}`
}

export function construirMensajeAlquiler(tituloAnuncio: string): string {
  return `Hola, me interesa alquilar "${tituloAnuncio}". ¿Está disponible?`
}

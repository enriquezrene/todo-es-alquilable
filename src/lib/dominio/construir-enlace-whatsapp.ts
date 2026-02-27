export function construirEnlaceWhatsApp(telefono: string, mensaje: string): string {
  const telefonoLimpio = telefono.replace(/[^0-9]/g, '')
  const mensajeCodificado = encodeURIComponent(mensaje)
  return `https://wa.me/${telefonoLimpio}?text=${mensajeCodificado}`
}

export function construirMensajeAlquiler(tituloAnuncio: string): string {
  return `Hola, me interesa alquilar "${tituloAnuncio}". ¿Está disponible?`
}

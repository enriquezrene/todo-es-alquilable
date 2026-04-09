export function normalizarTelefonoWhatsApp(telefono: string): string {
  const soloDigitos = telefono.replace(/\D/g, '')

  if (soloDigitos.startsWith('593') && soloDigitos.length === 12) {
    return soloDigitos
  }

  if (soloDigitos.startsWith('0') && soloDigitos.length === 10) {
    return `593${soloDigitos.slice(1)}`
  }

  return soloDigitos
}

export function construirEnlaceWhatsApp(telefono: string, mensaje: string): string {
  const telefonoLimpio = normalizarTelefonoWhatsApp(telefono)
  const mensajeCodificado = encodeURIComponent(mensaje)
  return `https://wa.me/${telefonoLimpio}?text=${mensajeCodificado}`
}

export function construirMensajeAlquiler(tituloAnuncio: string): string {
  return `Hola, me interesa alquilar "${tituloAnuncio}". ¿Está disponible?`
}

export function validarTelefonoEcuador(telefono: string): boolean {
  const telefonoLimpio = telefono.trim()
  const patronLocal = /^0\d{9}$/
  const patronInternacional = /^\+?593\d{9}$/

  return patronLocal.test(telefonoLimpio) || patronInternacional.test(telefonoLimpio)
}

export function formatearTelefonoEcuador(telefono: string): string {
  const soloDigitos = telefono.replace(/[^0-9]/g, '')

  if (soloDigitos.startsWith('593') && soloDigitos.length === 12) {
    return `0${soloDigitos.slice(3)}`
  }

  if (soloDigitos.startsWith('0') && soloDigitos.length === 10) {
    return soloDigitos
  }

  if (soloDigitos.length === 9) {
    return `0${soloDigitos}`
  }

  return telefono
}

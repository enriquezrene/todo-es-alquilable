export function validarTelefonoEcuador(telefono: string): boolean {
  const patron = /^\+593\d{9}$/
  return patron.test(telefono)
}

export function formatearTelefonoEcuador(telefono: string): string {
  const soloDigitos = telefono.replace(/[^0-9]/g, '')

  if (soloDigitos.startsWith('593') && soloDigitos.length === 12) {
    return `+${soloDigitos}`
  }

  if (soloDigitos.startsWith('0') && soloDigitos.length === 10) {
    return `+593${soloDigitos.slice(1)}`
  }

  if (soloDigitos.length === 9) {
    return `+593${soloDigitos}`
  }

  return telefono
}

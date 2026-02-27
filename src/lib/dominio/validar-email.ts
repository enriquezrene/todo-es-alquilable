export function validarEmail(email: string): boolean {
  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return patron.test(email)
}

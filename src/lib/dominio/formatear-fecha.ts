export function formatearFecha(fecha: Date | string): string {
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha

  return new Intl.DateTimeFormat('es-EC', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatearFechaCorta(fecha: Date | string): string {
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha

  return new Intl.DateTimeFormat('es-EC', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function formatearFechaRelativa(fecha: Date | string): string {
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha
  const ahora = new Date()
  const diffMs = ahora.getTime() - date.getTime()
  const diffMinutos = Math.floor(diffMs / 60000)
  const diffHoras = Math.floor(diffMinutos / 60)
  const diffDias = Math.floor(diffHoras / 24)

  if (diffMinutos < 1) return 'hace un momento'
  if (diffMinutos < 60) return `hace ${diffMinutos} ${diffMinutos === 1 ? 'minuto' : 'minutos'}`
  if (diffHoras < 24) return `hace ${diffHoras} ${diffHoras === 1 ? 'hora' : 'horas'}`
  if (diffDias < 30) return `hace ${diffDias} ${diffDias === 1 ? 'día' : 'días'}`

  return formatearFecha(date)
}

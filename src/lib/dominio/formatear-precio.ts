import { type UnidadPrecio, etiquetasUnidad } from './unidades-precio'

export function formatearPrecio(precio: number, unidad?: UnidadPrecio): string {
  const formateado = new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(precio)

  if (unidad) {
    return `${formateado} ${etiquetasUnidad[unidad]}`
  }

  return formateado
}

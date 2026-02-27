export type ErrorRangoPrecio = string | null

export function validarRangoPrecio(
  precioMin?: number,
  precioMax?: number,
): ErrorRangoPrecio {
  if (precioMin !== undefined && precioMin < 0) {
    return 'El precio mínimo no puede ser negativo'
  }

  if (precioMax !== undefined && precioMax < 0) {
    return 'El precio máximo no puede ser negativo'
  }

  if (precioMin !== undefined && precioMax !== undefined && precioMin > precioMax) {
    return 'El precio mínimo no puede ser mayor al máximo'
  }

  return null
}

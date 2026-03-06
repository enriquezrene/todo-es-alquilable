import type { FormularioAnuncio } from '../types'
import type { ErroresFormulario } from '@/features/auth/types'

export function validarPasoCategoria(datos: FormularioAnuncio): ErroresFormulario {
  const errores: ErroresFormulario = {}

  if (!datos.categoryId && !datos.suggestedCategory.trim()) {
    errores.categoryId = 'Selecciona una categoría o sugiere una nueva'
  }

  return errores
}

export function validarPasoFotos(datos: FormularioAnuncio): ErroresFormulario {
  const errores: ErroresFormulario = {}

  if (datos.imageSlots.length === 0) {
    errores.images = 'Agrega al menos una foto'
  }

  if (datos.imageSlots.length > 3) {
    errores.images = 'Máximo 3 fotos permitidas'
  }

  const maxSize = 5 * 1024 * 1024
  const imagenGrande = datos.imageSlots.find(
    (slot) => slot.tipo === 'nueva' && slot.file.size > maxSize
  )
  if (imagenGrande) {
    errores.images = 'Cada imagen debe ser menor a 5MB'
  }

  return errores
}

export function validarPasoDetalles(datos: FormularioAnuncio): ErroresFormulario {
  const errores: ErroresFormulario = {}

  if (!datos.title.trim()) {
    errores.title = 'El título es requerido'
  } else if (datos.title.trim().length < 10) {
    errores.title = 'El título debe tener al menos 10 caracteres'
  } else if (datos.title.trim().length > 100) {
    errores.title = 'El título no puede exceder 100 caracteres'
  }

  if (!datos.description.trim()) {
    errores.description = 'La descripción es requerida'
  } else if (datos.description.trim().length < 30) {
    errores.description = 'La descripción debe tener al menos 30 caracteres'
  } else if (datos.description.trim().length > 1000) {
    errores.description = 'La descripción no puede exceder 1000 caracteres'
  }

  if (!datos.condition) {
    errores.condition = 'Selecciona la condición del artículo'
  }

  return errores
}

export function validarPasoPrecio(datos: FormularioAnuncio): ErroresFormulario {
  const errores: ErroresFormulario = {}

  const precio = parseFloat(datos.price)
  if (!datos.price || isNaN(precio)) {
    errores.price = 'El precio es requerido'
  } else if (precio <= 0) {
    errores.price = 'El precio debe ser mayor a 0'
  }

  if (!datos.priceUnit) {
    errores.priceUnit = 'Selecciona la unidad de precio'
  }

  if (!datos.province) {
    errores.province = 'Selecciona la provincia'
  }

  return errores
}

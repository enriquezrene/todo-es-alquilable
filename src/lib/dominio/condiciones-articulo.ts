export const CONDICIONES_ARTICULO = {
  NUEVO: 'nuevo',
  COMO_NUEVO: 'como_nuevo',
  BUEN_ESTADO: 'buen_estado',
  ACEPTABLE: 'aceptable',
} as const

export type CondicionArticulo = (typeof CONDICIONES_ARTICULO)[keyof typeof CONDICIONES_ARTICULO]

export const etiquetasCondicion: Record<CondicionArticulo, string> = {
  nuevo: 'Nuevo',
  como_nuevo: 'Como nuevo',
  buen_estado: 'Buen estado',
  aceptable: 'Aceptable',
}

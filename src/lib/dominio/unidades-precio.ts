export const UNIDADES_PRECIO = {
  HORA: 'hora',
  DIA: 'dia',
  SEMANA: 'semana',
  MES: 'mes',
} as const

export type UnidadPrecio = (typeof UNIDADES_PRECIO)[keyof typeof UNIDADES_PRECIO]

export const etiquetasUnidad: Record<UnidadPrecio, string> = {
  hora: 'por hora',
  dia: 'por día',
  semana: 'por semana',
  mes: 'por mes',
}

export type SearchParams = {
  q?: string
  categoria?: string
  provincia?: string
  precioMin?: string
  precioMax?: string
  orden?: 'reciente' | 'precio_asc' | 'precio_desc'
  pagina?: string
}

export type SearchFilters = {
  query: string
  categoryId: string
  province: string
  priceMin: number | undefined
  priceMax: number | undefined
  sortBy: 'reciente' | 'precio_asc' | 'precio_desc'
  page: number
}

export function parseSearchParams(params: SearchParams): SearchFilters {
  return {
    query: params.q || '',
    categoryId: params.categoria || '',
    province: params.provincia || '',
    priceMin: params.precioMin ? Number(params.precioMin) : undefined,
    priceMax: params.precioMax ? Number(params.precioMax) : undefined,
    sortBy: (params.orden as SearchFilters['sortBy']) || 'reciente',
    page: params.pagina ? Number(params.pagina) : 1,
  }
}

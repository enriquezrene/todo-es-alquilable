import { describe, it, expect, vi, afterEach } from 'vitest'
import { formatearFecha, formatearFechaCorta, formatearFechaRelativa } from './formatear-fecha'

describe('formatearFecha', () => {
  it('formatea un objeto Date', () => {
    const fecha = new Date(2024, 0, 15)
    const resultado = formatearFecha(fecha)
    expect(resultado).toContain('15')
    expect(resultado).toContain('2024')
  })

  it('formatea un string ISO', () => {
    const resultado = formatearFecha('2024-06-20T00:00:00')
    expect(resultado).toContain('20')
    expect(resultado).toContain('2024')
  })
})

describe('formatearFechaCorta', () => {
  it('formatea fecha en formato corto', () => {
    const fecha = new Date(2024, 5, 20)
    const resultado = formatearFechaCorta(fecha)
    expect(resultado).toContain('20')
    expect(resultado).toContain('2024')
  })
})

describe('formatearFechaRelativa', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('retorna "hace un momento" para fechas muy recientes', () => {
    vi.useFakeTimers()
    const ahora = new Date(2024, 0, 15, 12, 0, 0)
    vi.setSystemTime(ahora)

    const resultado = formatearFechaRelativa(new Date(2024, 0, 15, 12, 0, 0))
    expect(resultado).toBe('hace un momento')
  })

  it('retorna minutos para menos de una hora', () => {
    vi.useFakeTimers()
    const ahora = new Date(2024, 0, 15, 12, 30, 0)
    vi.setSystemTime(ahora)

    const resultado = formatearFechaRelativa(new Date(2024, 0, 15, 12, 0, 0))
    expect(resultado).toContain('minutos')
  })

  it('retorna horas para menos de un día', () => {
    vi.useFakeTimers()
    const ahora = new Date(2024, 0, 15, 15, 0, 0)
    vi.setSystemTime(ahora)

    const resultado = formatearFechaRelativa(new Date(2024, 0, 15, 12, 0, 0))
    expect(resultado).toContain('hora')
  })

  it('retorna días para menos de un mes', () => {
    vi.useFakeTimers()
    const ahora = new Date(2024, 0, 20, 12, 0, 0)
    vi.setSystemTime(ahora)

    const resultado = formatearFechaRelativa(new Date(2024, 0, 15, 12, 0, 0))
    expect(resultado).toContain('día')
  })
})

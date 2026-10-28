import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { App } from './App'

describe('Infraestructura de navegación', () => {
  it.each([
    ['/', '¿Qué cocino hoy?'],
    ['/despensa', 'Mi despensa'],
    ['/recetas', 'Explorar recetas'],
    ['/recetas/1', 'Detalle de receta'],
    ['/inexistente', 'Página no encontrada'],
  ])('renderiza %s', (route, heading) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ status: 'UP' }) }))
    render(<MemoryRouter initialEntries={[route]}><App /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument()
  })

  it('muestra la conexión con el servidor', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ status: 'UP' }) }))
    render(<MemoryRouter><App /></MemoryRouter>)
    expect(await screen.findByText('Servidor conectado')).toBeInTheDocument()
    expect(fetch).toHaveBeenCalledWith('/api/health', expect.any(Object))
  })

  it('informa cuando el servidor no responde', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Sin conexión')))
    render(<MemoryRouter><App /></MemoryRouter>)
    expect(await screen.findByText('No se pudo conectar con el servidor')).toBeInTheDocument()
  })
})

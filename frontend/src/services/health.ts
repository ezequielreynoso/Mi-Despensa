export async function getHealth(signal?: AbortSignal): Promise<void> {
  const response = await fetch('/api/health', { signal })
  if (!response.ok) throw new Error('No se pudo conectar con el servidor')
  const data: unknown = await response.json()
  if (!data || typeof data !== 'object' || !('status' in data) || data.status !== 'UP') {
    throw new Error('Respuesta de estado inesperada')
  }
}

import { useEffect, useState } from 'react'
import { getHealth } from '../services/health'

export function ServerStatus() {
  const [status, setStatus] = useState('Comprobando conexión…')
  useEffect(() => {
    const controller = new AbortController()
    getHealth(controller.signal)
      .then(() => setStatus('Servidor conectado'))
      .catch(() => {
        if (!controller.signal.aborted) setStatus('No se pudo conectar con el servidor')
      })
    return () => controller.abort()
  }, [])
  return <p role="status" className="mt-6 text-sm text-stone-600">{status}</p>
}

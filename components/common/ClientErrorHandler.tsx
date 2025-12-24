'use client'

import { useEffect } from 'react'

/**
 * Composant qui capture les erreurs globales côté client
 * (erreurs non capturées par ErrorBoundary)
 */
export default function ClientErrorHandler() {
  useEffect(() => {
    const maybeRecoverChunkError = (message?: string, name?: string) => {
      const isChunkError =
        name === 'ChunkLoadError' ||
        (message && (message.includes('Loading chunk') || message.includes('ChunkLoadError')))

      if (!isChunkError) return false

      try {
        const key = 'influencecore_chunk_reload_attempted'
        const attempted = sessionStorage.getItem(key) === 'true'
        if (!attempted) {
          sessionStorage.setItem(key, 'true')
          console.warn('[ChunkLoadError] Reload automatique (1 tentative)')
          window.location.reload()
          return true
        }
      } catch {
        // ignore
      }

      return false
    }

    // Capturer les erreurs JavaScript non gérées
    const handleError = (event: ErrorEvent) => {
      // Tentative de récupération si chunk JS introuvable (cache/mismatch)
      if (maybeRecoverChunkError(event.message, (event.error as any)?.name)) {
        return
      }
      logClientError({
        message: event.message || 'Erreur JavaScript',
        stack: event.error?.stack,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        type: 'javascript',
      })
    }

    // Capturer les promesses rejetées non gérées
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (
        maybeRecoverChunkError(
          event.reason?.message || String(event.reason),
          event.reason?.name
        )
      ) {
        return
      }
      logClientError({
        message: event.reason?.message || String(event.reason) || 'Promesse rejetée',
        stack: event.reason?.stack,
        type: 'unhandledRejection',
      })
    }

    // Ajouter les listeners
    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    // Nettoyer les listeners au démontage
    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return null
}

/**
 * Logger une erreur côté client
 */
async function logClientError(data: {
  message: string
  stack?: string
  filename?: string
  lineno?: number
  colno?: number
  type?: string
}) {
  // Toujours logger dans la console
  console.error('Client Error:', data)
  
  // Essayer de logger dans l'API (sans bloquer si elle n'existe pas)
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 2000)
    
    await fetch('/api/logs/client-error', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        message: data.message,
        stack: data.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        context: JSON.stringify({
          filename: data.filename,
          lineno: data.lineno,
          colno: data.colno,
          type: data.type,
        }),
      }),
    })
    clearTimeout(timeoutId)
  } catch (error: any) {
    // Ignorer les erreurs de logging (non bloquant)
    if (error.name !== 'AbortError') {
      console.warn('Erreur lors du logging côté client (non bloquant):', error)
    }
  }
}


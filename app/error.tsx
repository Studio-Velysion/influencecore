'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  const isChunkLoadError =
    (error?.name === 'ChunkLoadError') ||
    (error?.message && error.message.includes('Loading chunk')) ||
    (error?.message && error.message.includes('ChunkLoadError'))

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0A0A0F',
      color: '#FFFFFF',
      padding: '2rem',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '600px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Une erreur est survenue
        </h2>
        <p style={{ color: '#9CA3AF', marginBottom: '2rem' }}>
          {isChunkLoadError
            ? "Le site a été mis à jour et votre navigateur essaie de charger un ancien fichier. Rechargez complètement la page."
            : "Désolé, une erreur inattendue s'est produite. Veuillez réessayer."}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            style={{
              backgroundColor: '#F59E0B',
              color: '#0A0A0F',
              fontWeight: '600',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Réessayer
          </button>
          {isChunkLoadError && (
            <button
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: 'transparent',
                color: '#FFFFFF',
                fontWeight: '600',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                border: '2px solid #F59E0B',
                cursor: 'pointer',
              }}
            >
              Recharger la page
            </button>
          )}
          <Link
            href="/dashboard"
            style={{
              backgroundColor: 'transparent',
              color: '#FFFFFF',
              fontWeight: '600',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: '2px solid #9333EA',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            Retour au Dashboard
          </Link>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details style={{ marginTop: '2rem', textAlign: 'left' }}>
            <summary style={{ cursor: 'pointer', color: '#9CA3AF', marginBottom: '1rem' }}>
              Détails de l&apos;erreur (dev)
            </summary>
            <pre style={{
              padding: '1rem',
              backgroundColor: '#1A1A24',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              overflow: 'auto',
              color: '#FFFFFF'
            }}>
              {error.message}
              {'\n\n'}
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}


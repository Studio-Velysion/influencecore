'use client'

import { useEffect } from 'react'

/**
 * Composant d'erreur global pour Next.js
 * Utilisé pour les erreurs critiques qui ne peuvent pas être capturées par error.tsx
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Logger l'erreur globale
    console.error('Global Error:', error)
  }, [error])

  return (
    <html lang="fr">
      <body>
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
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Erreur Critique
            </h1>
            <p style={{ color: '#9CA3AF', marginBottom: '2rem' }}>
              Une erreur critique s&apos;est produite. Veuillez recharger la page.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
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
              <button
                onClick={() => window.location.href = '/'}
                style={{
                  backgroundColor: 'transparent',
                  color: '#FFFFFF',
                  fontWeight: '600',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #9333EA',
                  cursor: 'pointer'
                }}
              >
                Page d&apos;accueil
              </button>
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
      </body>
    </html>
  )
}


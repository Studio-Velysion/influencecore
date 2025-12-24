'use client'

import { Component, ReactNode } from 'react'
import ErrorBoundary from './ErrorBoundary'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

/**
 * ErrorBoundary amélioré qui log les erreurs dans la base de données
 */
export default class ErrorBoundaryWithLogging extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  async componentDidCatch(error: Error, errorInfo: any) {
    // Toujours logger dans la console pour le développement
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Logger l'erreur côté client (sans bloquer si l'API n'existe pas)
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
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
      })
      clearTimeout(timeoutId)
    } catch (logError: any) {
      // Ignorer les erreurs de logging (API peut ne pas exister)
      if (logError.name !== 'AbortError') {
        console.warn('Erreur lors du logging (non bloquant):', logError)
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                Une erreur est survenue
              </h2>
              <p className="text-text-secondary mb-6">
                Désolé, une erreur inattendue s'est produite. L'erreur a été enregistrée et sera examinée.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-4 p-4 bg-bg-secondary rounded-lg text-left">
                  <p className="text-sm text-text-tertiary font-mono break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: undefined })
                  window.location.reload()
                }}
                className="bg-gold-500 text-text-inverse px-6 py-3 rounded-lg hover:bg-gold-600 transition-colors font-semibold"
              >
                Recharger la page
              </button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}


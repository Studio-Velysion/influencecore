// Utilitaires pour les appels API avec gestion d'erreurs centralisée

import toast from 'react-hot-toast'

export interface ApiError {
  error: string
  status?: number
}

export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      const error: ApiError = {
        error: data.error || 'Une erreur est survenue',
        status: response.status,
      }
      throw error
    }

    return data
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw {
        error: 'Impossible de se connecter au serveur',
        status: 0,
      } as ApiError
    }
    throw error
  }
}

export function handleApiError(error: unknown, defaultMessage?: string) {
  const apiError = error as ApiError
  const message = apiError?.error || defaultMessage || 'Une erreur est survenue'
  
  toast.error(message)
  
  return message
}

export function handleApiSuccess(message: string) {
  toast.success(message)
}


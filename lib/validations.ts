// Validations centralisées pour toute l'application

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: string): boolean {
  return emailRegex.test(email)
}

export function validatePassword(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 6) {
    errors.push('Le mot de passe doit contenir au moins 6 caractères')
  }

  if (password.length > 100) {
    errors.push('Le mot de passe ne peut pas dépasser 100 caractères')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export function validateTitle(title: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!title || title.trim().length === 0) {
    errors.push('Le titre est requis')
  }

  if (title.length > 200) {
    errors.push('Le titre ne peut pas dépasser 200 caractères')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export function validateContent(content: string, maxLength: number = 10000): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (content.length > maxLength) {
    errors.push(`Le contenu ne peut pas dépasser ${maxLength} caractères`)
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/\s+/g, ' ')
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'À l\'instant'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`
  }

  return formatDate(d)
}


// Constantes de l'application

export const STATUSES = [
  'Idée',
  'Écriture',
  'Tournage',
  'Montage',
  'Programmée',
  'Publiée',
] as const

export const PRIORITIES = ['Haute', 'Moyenne', 'Basse'] as const

export const PLATFORMS = [
  'YouTube',
  'Twitch',
  'TikTok',
  'Instagram',
  'Autre',
] as const

export const FORMATS = ['Long', 'Short', 'Live'] as const

export const STATUS_COLORS: Record<string, string> = {
  'Idée': 'bg-gray-100 text-gray-800',
  'Écriture': 'bg-blue-100 text-blue-800',
  'Tournage': 'bg-yellow-100 text-yellow-800',
  'Montage': 'bg-purple-100 text-purple-800',
  'Programmée': 'bg-orange-100 text-orange-800',
  'Publiée': 'bg-green-100 text-green-800',
}

export const PRIORITY_COLORS: Record<string, string> = {
  'Haute': 'text-red-600 font-semibold',
  'Moyenne': 'text-yellow-600',
  'Basse': 'text-gray-600',
}

export const PAGINATION_LIMIT = 20

export const DEBOUNCE_DELAY = 300

export const MAX_TITLE_LENGTH = 200
export const MAX_CONTENT_LENGTH = 10000
export const MIN_PASSWORD_LENGTH = 6


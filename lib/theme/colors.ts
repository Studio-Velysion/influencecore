/**
 * Palette de couleurs Studio Velysion
 * Thème sombre premium avec accents violets et jaune doré
 */

export const velysionColors = {
  // Fond principal - Noir profond
  background: {
    primary: '#0A0A0F',      // Noir profond principal
    secondary: '#12121A',    // Gris anthracite
    tertiary: '#1A1A24',     // Noir adouci pour cartes
    card: 'rgba(26, 26, 36, 0.8)', // Cartes avec transparence
    hover: '#1F1F2E',        // Hover sur éléments
  },

  // Accents violets (branding)
  purple: {
    50: '#F3E8FF',
    100: '#E9D5FF',
    200: '#D8B4FE',
    300: '#C084FC',
    400: '#A855F7',
    500: '#9333EA',  // Violet principal
    600: '#7E22CE',
    700: '#6B21A8',
    800: '#581C87',
    900: '#4C1D95',
  },

  // Dégradé violet → rose
  gradient: {
    purplePink: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
    purplePinkHover: 'linear-gradient(135deg, #A855F7 0%, #F472B6 100%)',
    purpleDark: 'linear-gradient(135deg, #6B21A8 0%, #9333EA 100%)',
  },

  // Jaune doré (CTA)
  gold: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',  // Jaune doré principal
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  // Texte
  text: {
    primary: '#FFFFFF',        // Blanc pur pour titres
    secondary: '#E5E7EB',      // Gris clair pour sous-titres
    tertiary: '#9CA3AF',       // Gris moyen pour texte courant
    muted: '#6B7280',          // Gris désaturé pour texte secondaire
    inverse: '#0A0A0F',        // Noir pour texte sur fond clair
  },

  // Bordures
  border: {
    default: 'rgba(147, 51, 234, 0.2)',  // Violet subtil
    hover: 'rgba(147, 51, 234, 0.4)',
    focus: 'rgba(147, 51, 234, 0.6)',
    dark: 'rgba(255, 255, 255, 0.1)',
  },

  // États
  state: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
} as const


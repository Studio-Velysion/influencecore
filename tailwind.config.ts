import type { Config } from 'tailwindcss'
import { velysionColors } from './lib/theme/colors'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Studio Velysion - Fond
        bg: {
          primary: velysionColors.background.primary,
          secondary: velysionColors.background.secondary,
          tertiary: velysionColors.background.tertiary,
          card: velysionColors.background.card,
          hover: velysionColors.background.hover,
        },
        // Studio Velysion - Violet (branding)
        purple: velysionColors.purple,
        // Studio Velysion - Jaune doré (CTA)
        gold: velysionColors.gold,
        // Studio Velysion - Texte
        text: {
          primary: velysionColors.text.primary,
          secondary: velysionColors.text.secondary,
          tertiary: velysionColors.text.tertiary,
          muted: velysionColors.text.muted,
          inverse: velysionColors.text.inverse,
        },
        // Studio Velysion - Bordures
        border: {
          default: velysionColors.border.default,
          hover: velysionColors.border.hover,
          focus: velysionColors.border.focus,
          dark: velysionColors.border.dark,
        },
        // États
        state: velysionColors.state,
      },
      backgroundImage: {
        'gradient-purple-pink': velysionColors.gradient.purplePink,
        'gradient-purple-pink-hover': velysionColors.gradient.purplePinkHover,
        'gradient-purple-dark': velysionColors.gradient.purpleDark,
      },
      boxShadow: {
        'velysion-sm': '0 2px 8px rgba(147, 51, 234, 0.1)',
        'velysion-md': '0 4px 16px rgba(147, 51, 234, 0.15)',
        'velysion-lg': '0 8px 32px rgba(147, 51, 234, 0.2)',
        'velysion-glow': '0 0 20px rgba(147, 51, 234, 0.3)',
        'gold-glow': '0 0 20px rgba(245, 158, 11, 0.4)',
      },
      transitionDuration: {
        'velysion': '250ms',
      },
    },
  },
  plugins: [],
}
export default config


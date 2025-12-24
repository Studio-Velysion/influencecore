'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { velysionColors } from '@/lib/theme/colors'
import { logger } from '@/lib/logger'
import { useEffect, useMemo } from 'react'

export default function ClientChakraProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // Mémoriser le système pour éviter les re-renders infinis
  // C'est CRUCIAL pour Chakra UI v3
  const system = useMemo(() => defaultSystem, [])

  useEffect(() => {
    logger.info('ClientChakraProvider', 'ChakraProvider initialisé')
  }, [])

  return (
    <>
      <style jsx global>{`
        :root {
          --chakra-colors-bg-primary: ${velysionColors.background.primary};
          --chakra-colors-bg-secondary: ${velysionColors.background.secondary};
          --chakra-colors-bg-tertiary: ${velysionColors.background.tertiary};
          --chakra-colors-bg-card: ${velysionColors.background.card};
          --chakra-colors-bg-hover: ${velysionColors.background.hover};
          --chakra-colors-text-primary: ${velysionColors.text.primary};
          --chakra-colors-text-secondary: ${velysionColors.text.secondary};
          --chakra-colors-text-tertiary: ${velysionColors.text.tertiary};
          --chakra-colors-text-muted: ${velysionColors.text.muted};
          --chakra-colors-text-inverse: ${velysionColors.text.inverse};
          --chakra-colors-purple-50: ${velysionColors.purple[50]};
          --chakra-colors-purple-100: ${velysionColors.purple[100]};
          --chakra-colors-purple-200: ${velysionColors.purple[200]};
          --chakra-colors-purple-300: ${velysionColors.purple[300]};
          --chakra-colors-purple-400: ${velysionColors.purple[400]};
          --chakra-colors-purple-500: ${velysionColors.purple[500]};
          --chakra-colors-purple-600: ${velysionColors.purple[600]};
          --chakra-colors-purple-700: ${velysionColors.purple[700]};
          --chakra-colors-purple-800: ${velysionColors.purple[800]};
          --chakra-colors-purple-900: ${velysionColors.purple[900]};
          --chakra-colors-gold-500: ${velysionColors.gold[500]};
          --chakra-colors-gold-600: ${velysionColors.gold[600]};
        }
        body {
          background-color: ${velysionColors.background.primary};
          color: ${velysionColors.text.primary};
          font-family: var(--font-plus-jakarta), -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }
      `}</style>
      <ChakraProvider value={system}>
        {children}
      </ChakraProvider>
    </>
  )
}


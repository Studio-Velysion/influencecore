'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'
import { logger } from '@/lib/logger'
import { useEffect } from 'react'

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    logger.info('SessionProvider', 'SessionProvider initialisé')
  }, [])

  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
}


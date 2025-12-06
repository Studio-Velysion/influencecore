import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SessionProvider from '@/components/providers/SessionProvider'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import Toast from '@/components/common/Toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'InfluenceCore - Plateforme de gestion pour créateurs',
  description: 'Organisez vos idées, scripts et workflow vidéo en un seul endroit',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ErrorBoundary>
          <SessionProvider>
            {children}
            <Toast />
          </SessionProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}


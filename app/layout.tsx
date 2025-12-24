import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import SessionProvider from '@/components/providers/SessionProvider'
import ErrorBoundaryWithLogging from '@/components/common/ErrorBoundaryWithLogging'
import ClientErrorHandler from '@/components/common/ClientErrorHandler'
import Toast from '@/components/common/Toast'
import SimpleLogger from '@/components/common/SimpleLogger'
import LoggerInit from '@/components/common/LoggerInit'
import ClientChakraProvider from '@/components/client/layout/ClientChakraProvider'

const inter = Inter({ subsets: ['latin'] })
const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
})

export const metadata: Metadata = {
  title: 'InfluenceCore - Plateforme de gestion pour créateurs',
  description: 'Organisez vos idées, scripts et workflow vidéo en un seul endroit',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Logger simple côté serveur
  if (process.env.NODE_ENV === 'development') {
    console.log('[RootLayout] Rendu du layout racine', {
      nodeEnv: process.env.NODE_ENV,
    })
  }

  return (
    <html lang="fr">
      <head>
        {/* AdminLTE CSS - Loaded globally for admin pages */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/overlayscrollbars@2.11.0/styles/overlayscrollbars.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/admin-lte@4.0.0-rc4/dist/css/adminlte.min.css"
        />
      </head>
      <body className={`${inter.className} ${plusJakarta.variable}`}>
        <ErrorBoundaryWithLogging>
          <LoggerInit />
          <ClientErrorHandler />
          <SimpleLogger />
          <SessionProvider>
            <ClientChakraProvider>
              {children}
              <Toast />
            </ClientChakraProvider>
          </SessionProvider>
        </ErrorBoundaryWithLogging>
      </body>
    </html>
  )
}


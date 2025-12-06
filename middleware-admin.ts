import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

// Middleware pour protéger les routes admin
export default withAuth(
  function middleware(req) {
    // La vérification des permissions se fait dans les API routes
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Vérifier que l'utilisateur est authentifié
        // La vérification isAdmin se fait dans les pages/API
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*'],
}


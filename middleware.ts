import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  // L'authentification/autorisation est gérée dans les layouts/pages (NextAuth + checkPermission)
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/ideas/:path*',
    '/scripts/:path*',
    '/calendar/:path*',
    '/notes/:path*',
    '/admin/:path*',
  ],
}


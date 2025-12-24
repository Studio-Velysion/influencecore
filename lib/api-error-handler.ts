/**
 * Wrapper pour les routes API qui capture automatiquement les erreurs
 */

import { NextRequest, NextResponse } from 'next/server'
import { logError } from './logger'
import { getServerSessionWithTest } from './auth'

/**
 * Extrait l'adresse IP de la requête
 */
function getIpAddress(request: NextRequest): string | undefined {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  return realIp || undefined
}

/**
 * Wrapper pour les handlers API qui capture automatiquement les erreurs
 */
export function withErrorLogging<T = any>(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse<T>>
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse<T>> => {
    try {
      return await handler(request, context)
    } catch (error) {
      // Récupérer la session pour obtenir l'ID utilisateur
      const session = await getServerSessionWithTest()
      
      // Logger l'erreur
      await logError(
        `Erreur API: ${request.method} ${request.nextUrl.pathname}`,
        error,
        {
          userId: session?.user?.id,
          url: request.nextUrl.pathname,
          method: request.method,
          userAgent: request.headers.get('user-agent') || undefined,
          ipAddress: getIpAddress(request),
          statusCode: 500,
        }
      )

      // Retourner une réponse d'erreur
      return NextResponse.json(
        {
          error: 'Une erreur est survenue',
          message: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
      )
    }
  }
}

/**
 * Helper pour logger une erreur dans une route API existante
 */
export async function logApiError(
  error: Error | unknown,
  request: NextRequest,
  additionalContext?: Record<string, any>
): Promise<void> {
  const session = await getServerSessionWithTest()
  
  await logError(
    `Erreur API: ${request.method} ${request.nextUrl.pathname}`,
    error,
    {
      userId: session?.user?.id,
      url: request.nextUrl.pathname,
      method: request.method,
      userAgent: request.headers.get('user-agent') || undefined,
      ipAddress: getIpAddress(request),
      ...additionalContext,
    }
  )
}


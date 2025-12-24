import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

/**
 * Route de test pour vérifier que le système de logs fonctionne
 * GET /api/test-logs
 */
export async function GET() {
  try {
    // Tester différents niveaux de logs
    logger.debug('TestLogs', 'Test de log debug')
    logger.info('TestLogs', 'Test de log info', { test: true, timestamp: new Date().toISOString() })
    logger.warn('TestLogs', 'Test de log warning')
    
    // Tester une erreur
    try {
      throw new Error('Test d\'erreur pour vérifier le système de logs')
    } catch (error) {
      logger.error('TestLogs', 'Test d\'erreur', error)
    }

    return NextResponse.json({
      success: true,
      message: 'Logs de test générés. Vérifiez le dossier logs/',
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    logger.error('TestLogs', 'Erreur lors du test des logs', error)
    return NextResponse.json(
      { error: 'Erreur lors du test', message: error.message },
      { status: 500 }
    )
  }
}


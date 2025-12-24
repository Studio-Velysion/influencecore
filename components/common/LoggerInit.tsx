'use client'

import { useEffect } from 'react'
import { logger } from '@/lib/logger'

/**
 * Composant qui initialise le logger globalement
 * S'assure que les fonctions sont disponibles dans window
 */
export default function LoggerInit() {
  useEffect(() => {
    // S'assurer que le logger est exposé globalement
    if (typeof window !== 'undefined') {
      try {
        ;(window as any).logger = logger
        ;(window as any).showLogs = () => logger.showLogs()
        ;(window as any).downloadLogs = () => logger.downloadLogs()
        ;(window as any).getLogStats = () => logger.getStats()
        ;(window as any).enableLogs = () => logger.enable()
        ;(window as any).disableLogs = () => logger.disable()
        ;(window as any).clearLogs = () => logger.clear()
        
        console.log('📋 Système de logs initialisé')
        console.log('💡 Commandes disponibles:')
        console.log('   - showLogs() : Afficher tous les logs')
        console.log('   - downloadLogs() : Télécharger les logs')
        console.log('   - getLogStats() : Voir les statistiques')
        console.log('   - logger.enable() : Activer les logs')
        console.log('   - logger.disable() : Désactiver les logs')
        
        logger.info('LoggerInit', 'Logger initialisé et exposé globalement')
      } catch (error) {
        console.error('Erreur lors de l\'initialisation du logger:', error)
      }
    }
  }, [])

  return null
}


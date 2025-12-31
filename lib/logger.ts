/**
 * Système de logging pour InfluenceCore
 * Utilisez ce logger pour diagnostiquer les problèmes
 * Les logs sont automatiquement enregistrés dans le dossier logs/
 */

import { writeToFile, writeErrorToFile } from './file-logger'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  timestamp: string
  level: LogLevel
  component: string
  message: string
  data?: any
}

class Logger {
  private logs: LogEntry[] = []
  private enabled: boolean = true
  private maxLogs: number = 1000

  constructor() {
    // Activer les logs en développement par défaut
    if (typeof window !== 'undefined') {
      // Toujours activer en développement côté client
      this.enabled = true // Toujours activé pour le debugging
      try {
        const stored = localStorage.getItem('debug-logs')
        if (stored !== null) {
          this.enabled = stored === 'true'
        }
      } catch (e) {
        // Ignorer les erreurs de localStorage
      }
    } else {
      // Côté serveur
      this.enabled = process.env.NODE_ENV === 'development' || process.env.ENABLE_LOGS === 'true'
    }
  }

  private formatTimestamp(): string {
    return new Date().toISOString()
  }

  private addLog(level: LogLevel, component: string, message: string, data?: any) {
    if (!this.enabled) return

    const entry: LogEntry = {
      timestamp: this.formatTimestamp(),
      level,
      component,
      message,
      data,
    }

    this.logs.push(entry)

    // Limiter le nombre de logs en mémoire
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    // Afficher dans la console avec un style approprié
    const style = this.getStyle(level)
    const prefix = `[${entry.timestamp}] [${level.toUpperCase()}] [${component}]`
    
    if (data) {
      console.log(`%c${prefix} ${message}`, style, data)
    } else {
      console.log(`%c${prefix} ${message}`, style)
    }

    // Enregistrer automatiquement dans un fichier (côté serveur uniquement)
    if (typeof window === 'undefined') {
      writeToFile(level, component, message, data)
    }
  }

  private getStyle(level: LogLevel): string {
    const styles = {
      debug: 'color: #888; font-size: 11px;',
      info: 'color: #2196F3; font-weight: bold;',
      warn: 'color: #FF9800; font-weight: bold;',
      error: 'color: #F44336; font-weight: bold; background: #ffebee; padding: 2px 4px;',
    }
    return styles[level]
  }

  debug(component: string, message: string, data?: any) {
    this.addLog('debug', component, message, data)
  }

  info(component: string, message: string, data?: any) {
    this.addLog('info', component, message, data)
  }

  warn(component: string, message: string, data?: any) {
    this.addLog('warn', component, message, data)
  }

  /**
   * Logger une erreur.
   *
   * Supporte 2 signatures (compat rétro avec tout le projet) :
   * - logger.error(component, error)
   * - logger.error(component, message, error, meta?)
   */
  error(component: string, messageOrError: any, errorOrMeta?: any, metaMaybe?: any) {
    const isMessageString = typeof messageOrError === 'string'

    const message = isMessageString
      ? (messageOrError as string)
      : (messageOrError?.message || String(messageOrError))

    const err = isMessageString ? errorOrMeta : messageOrError
    const meta = isMessageString ? metaMaybe : errorOrMeta

    this.addLog('error', component, message, {
      error: err,
      stack: err?.stack,
      meta,
    })

    // Enregistrer les erreurs dans un fichier séparé (côté serveur uniquement)
    if (typeof window === 'undefined') {
      writeErrorToFile(component, err, { message, meta })
    }
  }

  // Obtenir tous les logs
  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  // Obtenir les logs d'un composant spécifique
  getLogsByComponent(component: string): LogEntry[] {
    return this.logs.filter(log => log.component === component)
  }

  // Obtenir les logs d'un niveau spécifique
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level)
  }

  // Exporter les logs au format JSON
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }

  // Télécharger les logs
  downloadLogs() {
    if (typeof window === 'undefined') return

    const data = this.exportLogs()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `influencecore-logs-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Afficher les logs dans la console
  showLogs() {
    console.group('📋 InfluenceCore Logs')
    this.logs.forEach(log => {
      const style = this.getStyle(log.level)
      const prefix = `[${log.timestamp}] [${log.level.toUpperCase()}] [${log.component}]`
      if (log.data) {
        console.log(`%c${prefix} ${log.message}`, style, log.data)
      } else {
        console.log(`%c${prefix} ${log.message}`, style)
      }
    })
    console.groupEnd()
  }

  // Activer/désactiver les logs
  enable() {
    this.enabled = true
    if (typeof window !== 'undefined') {
      localStorage.setItem('debug-logs', 'true')
    }
  }

  disable() {
    this.enabled = false
    if (typeof window !== 'undefined') {
      localStorage.setItem('debug-logs', 'false')
    }
  }

  // Vider les logs
  clear() {
    this.logs = []
  }

  // Obtenir les statistiques
  getStats() {
    return {
      total: this.logs.length,
      byLevel: {
        debug: this.logs.filter(l => l.level === 'debug').length,
        info: this.logs.filter(l => l.level === 'info').length,
        warn: this.logs.filter(l => l.level === 'warn').length,
        error: this.logs.filter(l => l.level === 'error').length,
      },
      byComponent: this.logs.reduce((acc, log) => {
        acc[log.component] = (acc[log.component] || 0) + 1
        return acc
      }, {} as Record<string, number>),
    }
  }
}

// Instance singleton
export const logger = new Logger()

/**
 * Helper compatible avec l'ancien code (ex: lib/api-error-handler.ts)
 * Permet de logger une erreur avec un message + un contexte optionnel.
 */
export async function logError(
  message: string,
  error: unknown,
  context?: Record<string, any>
): Promise<void> {
  // On garde un "component" stable pour retrouver facilement ces erreurs.
  logger.error('api', message, error, context)
}

// Exposer globalement pour le debugging
if (typeof window !== 'undefined') {
  // Fonction pour initialiser le logger global
  const initGlobalLogger = () => {
    try {
      ;(window as any).logger = logger
      ;(window as any).showLogs = () => logger.showLogs()
      ;(window as any).downloadLogs = () => logger.downloadLogs()
      ;(window as any).getLogStats = () => logger.getStats()
      ;(window as any).enableLogs = () => logger.enable()
      ;(window as any).disableLogs = () => logger.disable()
      ;(window as any).clearLogs = () => logger.clear()
      console.log('📋 Système de logs activé. Utilisez showLogs() pour voir les logs.')
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du logger:', error)
    }
  }

  // Initialiser immédiatement si possible
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalLogger)
  } else {
    initGlobalLogger()
  }

  // Aussi initialiser après un court délai pour être sûr
  setTimeout(initGlobalLogger, 100)
  setTimeout(initGlobalLogger, 500)
  setTimeout(initGlobalLogger, 1000)
}

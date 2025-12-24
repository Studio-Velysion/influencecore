/**
 * Système de logging automatique dans des fichiers
 * Les logs sont automatiquement enregistrés dans le dossier logs/
 */

import fs from 'fs'
import path from 'path'

const LOGS_DIR = path.join(process.cwd(), 'logs')

// Créer le dossier logs s'il n'existe pas
if (typeof window === 'undefined' && !fs.existsSync(LOGS_DIR)) {
  try {
    fs.mkdirSync(LOGS_DIR, { recursive: true })
  } catch (error) {
    console.error('Erreur lors de la création du dossier logs:', error)
  }
}

/**
 * Obtenir le nom du fichier de log pour aujourd'hui
 */
function getLogFileName(): string {
  const today = new Date()
  const dateStr = today.toISOString().split('T')[0] // YYYY-MM-DD
  return `app-${dateStr}.log`
}

/**
 * Obtenir le chemin complet du fichier de log
 */
function getLogFilePath(): string {
  return path.join(LOGS_DIR, getLogFileName())
}

/**
 * Formater un message de log
 */
function formatLogMessage(level: string, component: string, message: string, data?: any): string {
  const timestamp = new Date().toISOString()
  const dataStr = data ? ` | Data: ${JSON.stringify(data)}` : ''
  return `[${timestamp}] [${level.toUpperCase()}] [${component}] ${message}${dataStr}\n`
}

/**
 * Écrire un log dans le fichier
 */
export function writeToFile(level: string, component: string, message: string, data?: any): void {
  // Ne fonctionne que côté serveur
  if (typeof window !== 'undefined') {
    return
  }

  try {
    const logMessage = formatLogMessage(level, component, message, data)
    const logFile = getLogFilePath()

    // Créer le dossier s'il n'existe pas (au cas où)
    if (!fs.existsSync(LOGS_DIR)) {
      fs.mkdirSync(LOGS_DIR, { recursive: true })
    }

    // Ajouter le log au fichier (append)
    fs.appendFileSync(logFile, logMessage, 'utf8')
  } catch (error) {
    // Ne pas bloquer l'application si l'écriture échoue
    console.error('Erreur lors de l\'écriture du log:', error)
  }
}

/**
 * Écrire une erreur dans un fichier séparé
 */
export function writeErrorToFile(component: string, error: Error | any, context?: any): void {
  if (typeof window !== 'undefined') {
    return
  }

  try {
    const timestamp = new Date().toISOString()
    const errorFile = path.join(LOGS_DIR, 'errors.log')
    
    const errorMessage = `[${timestamp}] [ERROR] [${component}]
Message: ${error?.message || String(error)}
Stack: ${error?.stack || 'N/A'}
Context: ${context ? JSON.stringify(context, null, 2) : 'N/A'}
---
`

    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(LOGS_DIR)) {
      fs.mkdirSync(LOGS_DIR, { recursive: true })
    }

    // Ajouter l'erreur au fichier
    fs.appendFileSync(errorFile, errorMessage, 'utf8')
  } catch (err) {
    console.error('Erreur lors de l\'écriture de l\'erreur:', err)
  }
}

/**
 * Nettoyer les anciens fichiers de logs (garder seulement les 30 derniers jours)
 */
export function cleanupOldLogs(): void {
  if (typeof window !== 'undefined') {
    return
  }

  try {
    if (!fs.existsSync(LOGS_DIR)) {
      return
    }

    const files = fs.readdirSync(LOGS_DIR)
    const now = Date.now()
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000

    files.forEach((file) => {
      const filePath = path.join(LOGS_DIR, file)
      const stats = fs.statSync(filePath)
      const fileAge = now - stats.mtimeMs

      // Supprimer les fichiers de plus de 30 jours
      if (fileAge > thirtyDaysInMs) {
        fs.unlinkSync(filePath)
        console.log(`Fichier de log supprimé: ${file}`)
      }
    })
  } catch (error) {
    console.error('Erreur lors du nettoyage des logs:', error)
  }
}

// Nettoyer les anciens logs au démarrage (une fois par jour)
if (typeof window === 'undefined') {
  cleanupOldLogs()
}


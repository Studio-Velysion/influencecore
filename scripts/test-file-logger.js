// Script Node.js pour tester directement l'écriture de logs
// Usage: node scripts/test-file-logger.js

const fs = require('fs')
const path = require('path')

const LOGS_DIR = path.join(process.cwd(), 'logs')

// Créer le dossier logs s'il n'existe pas
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true })
  console.log('✅ Dossier logs créé')
}

// Obtenir le nom du fichier de log pour aujourd'hui
function getLogFileName() {
  const today = new Date()
  const dateStr = today.toISOString().split('T')[0] // YYYY-MM-DD
  return `app-${dateStr}.log`
}

// Formater un message de log
function formatLogMessage(level, component, message, data) {
  const timestamp = new Date().toISOString()
  const dataStr = data ? ` | Data: ${JSON.stringify(data)}` : ''
  return `[${timestamp}] [${level.toUpperCase()}] [${component}] ${message}${dataStr}\n`
}

// Tester l'écriture
const logFile = path.join(LOGS_DIR, getLogFileName())
const testMessage = formatLogMessage('info', 'TestScript', 'Test d\'écriture de log', { test: true })

try {
  fs.appendFileSync(logFile, testMessage, 'utf8')
  console.log('✅ Log écrit avec succès dans:', logFile)
  
  // Lire le fichier pour vérifier
  const content = fs.readFileSync(logFile, 'utf8')
  console.log('\n📄 Contenu du fichier:')
  console.log(content)
  
  // Vérifier la taille
  const stats = fs.statSync(logFile)
  console.log(`\n📊 Taille du fichier: ${(stats.size / 1024).toFixed(2)} KB`)
} catch (error) {
  console.error('❌ Erreur lors de l\'écriture:', error)
}


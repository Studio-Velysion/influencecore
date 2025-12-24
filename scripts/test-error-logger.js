// Script pour tester l'écriture d'erreurs dans errors.log
// Usage: node scripts/test-error-logger.js

const fs = require('fs')
const path = require('path')

const LOGS_DIR = path.join(process.cwd(), 'logs')

// Créer le dossier logs s'il n'existe pas
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true })
}

const errorFile = path.join(LOGS_DIR, 'errors.log')

const timestamp = new Date().toISOString()
const errorMessage = `[${timestamp}] [ERROR] [TestScript]
Message: Test d'erreur pour vérifier le système de logs
Stack: Error: Test d'erreur
    at Object.<anonymous> (test-error-logger.js:15:5)
    at Module._compile (internal/modules/cjs/loader.js:1063:30)
Context: {"test":true,"component":"TestScript"}
---
`

try {
  fs.appendFileSync(errorFile, errorMessage, 'utf8')
  console.log('✅ Erreur écrite avec succès dans:', errorFile)
  
  // Lire le fichier pour vérifier
  const content = fs.readFileSync(errorFile, 'utf8')
  console.log('\n📄 Contenu du fichier errors.log:')
  console.log(content)
  
  // Vérifier la taille
  const stats = fs.statSync(errorFile)
  console.log(`\n📊 Taille du fichier: ${(stats.size / 1024).toFixed(2)} KB`)
} catch (error) {
  console.error('❌ Erreur lors de l\'écriture:', error)
}


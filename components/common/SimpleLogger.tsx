'use client'

import { useEffect } from 'react'

export default function SimpleLogger() {
  useEffect(() => {
    // Logger simple qui fonctionne toujours
    console.log('🚀 SimpleLogger monté')
    console.log('📋 Pour voir les logs détaillés, tapez dans la console :')
    console.log('   - showLogs()')
    console.log('   - logger.getLogs()')
    console.log('   - logger.getStats()')
    
    // Vérifier si logger est disponible
    if (typeof window !== 'undefined') {
      const checkLogger = setInterval(() => {
        if ((window as any).logger) {
          console.log('✅ Logger disponible')
          clearInterval(checkLogger)
        }
      }, 100)
      
      setTimeout(() => {
        clearInterval(checkLogger)
      }, 5000)
    }
  }, [])

  return null
}


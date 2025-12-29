import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

/**
 * Wrapper pour getServerSession qui retourne une session de test en mode dev
 */
export async function getServerSessionWithTest() {
  try {
    // Timeout pour éviter les blocages
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Session timeout')), 2000)
    })
    
    const sessionPromise = getServerSession(authOptions)
    return await Promise.race([sessionPromise, timeoutPromise]) as any
  } catch (error) {
    // En cas d'erreur ou timeout, retourner null pour permettre le fallback
    console.warn('Erreur lors de la récupération de la session:', error)
    return null
  }
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Non authentifié')
  }
  return user
}


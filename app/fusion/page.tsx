'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Route de compat (CLIENT) : Fusion a été remplacé par Messa.
// Important: en page server-only avec redirect(), Next peut ne pas générer le chunk client,
// ce qui provoque un ChunkLoadError sur des anciens prefetch.
export default function FusionRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/messa')
  }, [router])

  return null
}



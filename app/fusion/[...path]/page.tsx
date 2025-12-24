'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Route de compat (CLIENT) : redirige tout /fusion/* vers /messa
export default function FusionCatchAllRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/messa')
  }, [router])

  return null
}



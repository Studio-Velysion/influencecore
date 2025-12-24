'use client'

import { Button } from '@chakra-ui/react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LogoutButtonChakra() {
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/login')
    router.refresh()
  }

  return (
    <Button
      onClick={handleLogout}
      size="sm"
      variant="ghost"
      color="text.secondary"
      _hover={{
        color: 'purple.400',
        bg: 'bg.hover',
      }}
    >
      Déconnexion
    </Button>
  )
}


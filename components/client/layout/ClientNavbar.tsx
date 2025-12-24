'use client'

import {
  Box,
  Flex,
  Text,
} from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import LogoutButtonChakra from './LogoutButtonChakra'

const routeNames: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/ideas': 'Idées Vidéos',
  '/scripts': 'Scripts',
  '/calendar': 'Calendrier',
  '/notes': 'Notes',
  '/messa': 'Messa',
  '/helpdesk/new': 'Créer un ticket',
  '/subscriptions': 'Abonnements',
}

export default function ClientNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()

  // Chakra UI v3: useColorModeValue n'existe plus
  const navbarBg = 'rgba(18, 18, 26, 0.8)'
  const navbarBorder = 'rgba(255, 255, 255, 0.1)'

  const brandText = routeNames[pathname || '/dashboard'] || 'Dashboard'

  return (
    <Flex
      position="absolute"
      top="20px"
      left={{ base: '20px', xl: '295px' }}
      right="20px"
      bg={navbarBg}
      backdropFilter="blur(42px)"
      border="1.5px solid"
      borderColor={navbarBorder}
      borderRadius="16px"
      minH="75px"
      alignItems="center"
      px={6}
      zIndex={1000}
      boxShadow="0px 7px 23px rgba(0, 0, 0, 0.05)"
    >
      <Flex flex="1" alignItems="center" justifyContent="space-between">
        <Flex alignItems="center" gap={2}>
          <Text
            color="text.secondary"
            _hover={{ color: 'purple.400', cursor: 'pointer' }}
            onClick={() => router.push('/dashboard')}
            style={{ textDecoration: 'none' }}
          >
            Dashboard
          </Text>
          <Text color="text.tertiary">/</Text>
          <Text color="text.primary" fontWeight="bold">
            {brandText}
          </Text>
        </Flex>

        <Flex alignItems="center" gap={4}>
          {session?.user && (
            <>
              <Text color="text.secondary" fontSize="sm">
                {session.user.name || session.user.email}
              </Text>
              <LogoutButtonChakra />
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  )
}


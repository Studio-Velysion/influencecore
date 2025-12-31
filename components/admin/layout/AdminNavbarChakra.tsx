'use client'

import {
  Box,
  Flex,
  Text,
  IconButton,
  Avatar,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { FiSettings, FiLogOut, FiUser } from 'react-icons/fi'
import { FiMenu as HamburgerIcon, FiChevronDown as ChevronDownIcon } from 'react-icons/fi'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

const routeNames: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/users': 'Utilisateurs',
  '/integrations/keycloak': 'Keycloak (Rôles)',
      '/admin/cms': 'CMS - Page d\'accueil',
      '/admin/logs': 'Logs d\'Erreurs',
      '/admin/settings': 'Paramètres',
}

export default function AdminNavbarChakra() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Fermer le menu quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  // Chakra UI v3: useColorModeValue n'existe plus
  const navbarBg = 'rgba(18, 18, 26, 0.8)'
  const navbarBorder = 'rgba(255, 255, 255, 0.1)'

  const getBrandText = () => {
    // Trouver la route correspondante dans routeNames
    const exactMatch = routeNames[pathname || '']
    if (exactMatch) return exactMatch

    // Chercher une correspondance partielle
    for (const [route, name] of Object.entries(routeNames)) {
      if (pathname?.startsWith(route)) {
        return name
      }
    }

    return 'Dashboard'
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/login')
    router.refresh()
  }

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
            onClick={() => router.push('/admin')}
            style={{ textDecoration: 'none' }}
          >
            Admin
          </Text>
          <Text color="text.tertiary">/</Text>
          <Text color="text.primary" fontWeight="bold">
            {getBrandText()}
          </Text>
        </Flex>

        <Flex alignItems="center" gap={4}>
          {session?.user && (
            <>
              <Text color="text.secondary" fontSize="sm" display={{ base: 'none', md: 'block' }}>
                {session.user.name || session.user.email}
              </Text>
              <Box position="relative" ref={menuRef}>
                <IconButton
                  variant="ghost"
                  borderRadius="full"
                  aria-label="Menu utilisateur"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <Avatar.Root size="sm" colorPalette="purple">
                    <Avatar.Fallback name={session.user.name || session.user.email || 'Admin'} />
                  </Avatar.Root>
                </IconButton>
                {isMenuOpen && (
                  <Box
                    position="absolute"
                    top="100%"
                    right={0}
                    mt={2}
                    bg="bg.secondary"
                    border="1px solid"
                    borderColor="rgba(255,255,255,0.1)"
                    borderRadius="md"
                    minW="200px"
                    boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                    zIndex={1000}
                  >
                    <Flex direction="column" p={1}>
                      <NextLink href="/admin/users" style={{ textDecoration: 'none' }} onClick={() => setIsMenuOpen(false)}>
                        <Box
                          px={4}
                          py={2}
                          display="flex"
                          alignItems="center"
                          gap={2}
                          color="text.primary"
                          _hover={{ bg: 'bg.hover' }}
                          borderRadius="md"
                        >
                          <FiUser size={16} />
                          Mon profil
                        </Box>
                      </NextLink>
                      <NextLink href="/admin/settings" style={{ textDecoration: 'none' }} onClick={() => setIsMenuOpen(false)}>
                        <Box
                          px={4}
                          py={2}
                          display="flex"
                          alignItems="center"
                          gap={2}
                          color="text.primary"
                          _hover={{ bg: 'bg.hover' }}
                          borderRadius="md"
                        >
                          <FiSettings size={16} />
                          Paramètres
                        </Box>
                      </NextLink>
                      <Box
                        px={4}
                        py={2}
                        display="flex"
                        alignItems="center"
                        gap={2}
                        color="text.secondary"
                        _hover={{ bg: 'bg.hover', color: 'red.400' }}
                        borderRadius="md"
                        cursor="pointer"
                        onClick={() => {
                          setIsMenuOpen(false)
                          handleLogout()
                        }}
                      >
                        <FiLogOut size={16} />
                        Déconnexion
                      </Box>
                    </Flex>
                  </Box>
                )}
              </Box>
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  )
}


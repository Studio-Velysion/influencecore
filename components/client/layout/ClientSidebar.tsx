'use client'

import {
  Box,
  Button,
  Flex,
  Text,
} from '@chakra-ui/react'
import { FiX } from 'react-icons/fi'
import { usePathname } from 'next/navigation'
import NextLink from 'next/link'
import { FiHome, FiVideo, FiFileText, FiCalendar, FiEdit3, FiLayout, FiLifeBuoy, FiCreditCard } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import { PERMISSIONS } from '@/lib/permissions'

interface RouteItem {
  path: string
  label: string
  icon: any
  permission?: string
  section?: 'client' | 'admin'
}

const clientRoutes: RouteItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: FiHome, section: 'client' },
  { path: '/messa', label: 'Messa', icon: FiLayout, permission: PERMISSIONS.MESSA_ACCESS, section: 'client' },
  { path: '/ideas', label: 'Idées', icon: FiVideo, permission: PERMISSIONS.IDEAS_VIEW, section: 'client' },
  { path: '/scripts', label: 'Scripts', icon: FiFileText, permission: PERMISSIONS.SCRIPTS_VIEW, section: 'client' },
  { path: '/calendar', label: 'Calendrier', icon: FiCalendar, permission: PERMISSIONS.CALENDAR_VIEW, section: 'client' },
  { path: '/notes', label: 'Notes', icon: FiEdit3, permission: PERMISSIONS.NOTES_VIEW, section: 'client' },
  { path: '/helpdesk/new', label: 'Créer un ticket', icon: FiLifeBuoy, permission: PERMISSIONS.HELPDESK_TICKETS_CREATE, section: 'client' },
  { path: '/subscriptions', label: 'Abonnements', icon: FiCreditCard, permission: PERMISSIONS.FOSSBILLING_SUBSCRIPTIONS_VIEW, section: 'client' },
]

interface UserPermissions {
  permissions: string[]
  isAdmin: boolean
  userId: string
}

export default function ClientSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [permissions, setPermissions] = useState<UserPermissions | null>(null)
  const [loading, setLoading] = useState(true)
  const onOpen = () => setIsOpen(true)
  const onClose = () => setIsOpen(false)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    let isMounted = true

    const fetchPermissions = async () => {
      try {
        // Timeout de 5 secondes pour éviter les chargements infinis
        const controller = new AbortController()
        timeoutId = setTimeout(() => controller.abort(), 5000)

        const response = await fetch('/api/user/permissions', {
          signal: controller.signal,
        })
        
        if (!isMounted) return

        if (response.ok) {
          const data = await response.json()
          setPermissions(data)
        }
      } catch (error: any) {
        if (!isMounted) return
        
        // Ignorer les erreurs d'abort (timeout)
        if (error.name !== 'AbortError') {
          console.error('Erreur lors de la récupération des permissions:', error)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
      }
    }

    fetchPermissions()

    return () => {
      isMounted = false
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  const hasPermission = (permission?: string) => {
    if (!permission) return true // Routes sans permission sont toujours visibles
    if (!permissions) return false
    if (permissions.isAdmin) return true
    return permissions.permissions.includes(permission)
  }

  const visibleClientRoutes = clientRoutes.filter(route => hasPermission(route.permission))
  const allRoutes: RouteItem[] = [...visibleClientRoutes]

  // Chakra UI v3: useColorModeValue n'existe plus, utiliser des valeurs directes
  const activeBg = 'rgba(147, 51, 234, 0.2)'
  const inactiveBg = 'transparent'
  const activeColor = '#A855F7'
  const inactiveColor = '#E5E7EB'

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname?.startsWith(path)
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <Box
        display={{ base: 'none', xl: 'block' }}
        position="fixed"
        left={0}
        top={0}
        w="275px"
        h="100vh"
        bg="linear-gradient(111.84deg, rgba(18, 18, 26, 0.94) 59.3%, rgba(26, 31, 55, 0) 100%)"
        backdropFilter="blur(10px)"
        borderRight="1px solid"
        borderColor="rgba(255, 255, 255, 0.1)"
        pt="120px"
        px={4}
        overflowY="auto"
        borderRadius="0 16px 16px 0"
        m="16px 0px 16px 16px"
      >
        {/* Logo/Brand */}
        <Box mb={8} pt={4}>
          <Text
            fontSize="sm"
            fontWeight="bold"
            letterSpacing="3px"
            color="text.primary"
            textAlign="center"
            bgGradient="linear(to-r, purple.400, pink.400)"
            bgClip="text"
          >
            INFLUENCECORE
          </Text>
        </Box>
        <Flex direction="column" gap={2}>
          {allRoutes.map((routeItem) => {
            const active = isActive(routeItem.path)
            const IconComponent = routeItem.icon
            return (
              <NextLink key={routeItem.path} href={routeItem.path} style={{ textDecoration: 'none' }}>
                <Button
                  w="100%"
                  justifyContent="flex-start"
                  alignItems="center"
                  bg={active ? activeBg : inactiveBg}
                  color={active ? activeColor : inactiveColor}
                  _hover={{
                    bg: activeBg,
                    color: activeColor,
                  }}
                  borderRadius="15px"
                  px={4}
                  py={3}
                  fontWeight={active ? 'bold' : 'normal'}
                  transition="all 0.2s"
                  variant="ghost"
                >
                  <Flex alignItems="center">
                    <IconComponent size={20} style={{ marginRight: '12px' }} />
                    {routeItem.label}
                  </Flex>
                </Button>
              </NextLink>
            )
          })}
        </Flex>
      </Box>

      {/* Mobile Drawer - Custom Implementation */}
      {isOpen && (
        <>
          {/* Overlay */}
          <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="rgba(0, 0, 0, 0.5)"
            zIndex={998}
            onClick={onClose}
          />
          {/* Drawer Content */}
          <Box
            position="fixed"
            top={0}
            left={0}
            w="275px"
            h="100vh"
            bg="linear-gradient(111.84deg, rgba(18, 18, 26, 0.94) 59.3%, rgba(26, 31, 55, 0) 100%)"
            backdropFilter="blur(10px)"
            borderRight="1px solid"
            borderColor="rgba(255, 255, 255, 0.1)"
            zIndex={999}
            overflowY="auto"
          >
            <Flex justifyContent="flex-end" p={4}>
              <Button variant="ghost" onClick={onClose} color="text.primary">
                <FiX size={20} />
              </Button>
            </Flex>
            <Box px={4} pb={8}>
              <Box mb={8}>
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  letterSpacing="3px"
                  color="text.primary"
                  textAlign="center"
                  bgGradient="linear(to-r, purple.400, pink.400)"
                  bgClip="text"
                >
                  INFLUENCECORE
                </Text>
              </Box>
              <Flex direction="column" gap={2}>
                {allRoutes.map((route, index) => {
                  if ('isSeparator' in route && route.isSeparator) {
                    return (
                      <Box key={`separator-mobile-${index}`} py={2}>
                        <Text color="text.tertiary" fontSize="xs" textAlign="center" opacity={0.5}>
                          ────────────
                        </Text>
                      </Box>
                    )
                  }
                  const routeItem = route as RouteItem
                  const active = isActive(routeItem.path)
                  const IconComponent = routeItem.icon
                  return (
                    <NextLink key={routeItem.path} href={routeItem.path} style={{ textDecoration: 'none' }} onClick={onClose}>
                      <Button
                        w="100%"
                        justifyContent="flex-start"
                        alignItems="center"
                        bg={active ? activeBg : inactiveBg}
                        color={active ? activeColor : inactiveColor}
                        _hover={{
                          bg: activeBg,
                          color: activeColor,
                        }}
                        borderRadius="15px"
                        px={4}
                        py={3}
                        fontWeight={active ? 'bold' : 'normal'}
                        variant="ghost"
                      >
                        <Flex alignItems="center">
                          <IconComponent size={20} style={{ marginRight: '12px' }} />
                          {routeItem.label}
                        </Flex>
                      </Button>
                    </NextLink>
                  )
                })}
              </Flex>
            </Box>
          </Box>
        </>
      )}
    </>
  )
}


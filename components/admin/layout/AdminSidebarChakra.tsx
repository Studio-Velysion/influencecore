'use client'

import {
  Box,
  Button,
  Flex,
  Text,
} from '@chakra-ui/react'
import { FiX } from 'react-icons/fi'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import NextLink from 'next/link'
import { FiChevronDown as ChevronDownIcon } from 'react-icons/fi'
import {
  FiHome,
  FiUsers,
  FiShield,
  FiSettings,
  FiLayout,
  FiAlertCircle,
} from 'react-icons/fi'

interface RouteItem {
  path: string
  label: string
  icon: any
  children?: RouteItem[]
}

const routes: RouteItem[] = [
  { path: '/admin', label: 'Dashboard', icon: FiHome },
  { path: '/admin/users', label: 'Utilisateurs', icon: FiUsers },
  { path: '/integrations/keycloak', label: 'Keycloak (Rôles)', icon: FiShield },
  { path: '/admin/logs', label: 'Logs d\'Erreurs', icon: FiAlertCircle },
  { path: '/admin/settings', label: 'Paramètres', icon: FiSettings },
]

export default function AdminSidebarChakra() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const onOpen = () => setIsOpen(true)
  const onClose = () => setIsOpen(false)
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([])

  const activeBg = 'rgba(147, 51, 234, 0.2)'
  const inactiveBg = 'transparent'
  const activeColor = '#A855F7'
  const inactiveColor = '#E5E7EB'

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin'
    }
    return pathname?.startsWith(path)
  }

  const toggleSubmenu = (path: string) => {
    setOpenSubmenus((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    )
  }

  const renderRoute = (route: RouteItem, level: number = 0) => {
    const active = isActive(route.path)
    const hasChildren = route.children && route.children.length > 0
    const isSubmenuOpen = openSubmenus.includes(route.path)

    const IconComponent = route.icon

    if (hasChildren) {
      return (
        <Box key={route.path} w="100%">
          <Button
            w="100%"
            justifyContent="space-between"
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
            onClick={() => toggleSubmenu(route.path)}
            mb={hasChildren ? 2 : 0}
          >
            <Flex alignItems="center" gap={2} flex="1">
              <IconComponent size={20} />
              {route.label}
            </Flex>
            <ChevronDownIcon
              size={16}
              style={{ transform: isSubmenuOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }}
            />
          </Button>
          {isSubmenuOpen && (
            <Flex direction="column" gap={2} ml={6} mt={2}>
              {route.children?.map((child) => renderRoute(child, level + 1))}
            </Flex>
          )}
        </Box>
      )
    }

    return (
      <NextLink key={route.path} href={route.path} style={{ textDecoration: 'none' }}>
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
            ml={level > 0 ? 4 : 0}
            onClick={onClose}
        >
          <Flex alignItems="center" gap={2}>
            <IconComponent size={20} />
            {route.label}
          </Flex>
        </Button>
      </NextLink>
    )
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
            INFLUENCECORE ADMIN
          </Text>
        </Box>

        <Flex direction="column" gap={2}>
          {routes.map((route) => renderRoute(route))}
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
                  INFLUENCECORE ADMIN
                </Text>
              </Box>
              <Flex direction="column" gap={2}>
                {routes.map((route) => renderRoute(route))}
              </Flex>
            </Box>
          </Box>
        </>
      )}
    </>
  )
}


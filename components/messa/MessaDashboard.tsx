'use client'

import { Box, SimpleGrid, Text, Flex, Spinner } from '@chakra-ui/react'
import { FiLayers, FiList, FiHash, FiCode, FiFileText, FiPackage } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PERMISSIONS } from '@/lib/permissions'

interface UserPermissions {
  permissions: string[]
  isAdmin: boolean
  userId: string
}

interface MessaCardData {
  path: string
  title: string
  description: string
  icon: any
  color: string
  permission: string
}

function MessaCard({ card }: { card: MessaCardData }) {
  const router = useRouter()
  const Icon = card.icon

  return (
    <Box
      bg="rgba(18, 18, 26, 0.6)"
      backdropFilter="blur(10px)"
      border="1px solid"
      borderColor="rgba(255, 255, 255, 0.1)"
      borderRadius="16px"
      p={6}
      cursor="pointer"
      onClick={() => router.push(card.path)}
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 32px rgba(147, 51, 234, 0.3)',
        borderColor: 'rgba(147, 51, 234, 0.3)',
      }}
      transition="all 0.3s"
    >
      <Flex justify="space-between" align="center">
        <Box>
          <Text fontSize="xl" fontWeight="bold" color="text.primary">
            {card.title}
          </Text>
          <Text color="text.secondary" fontSize="sm" mt={1}>
            {card.description}
          </Text>
        </Box>
        <Box
          h="45px"
          w="45px"
          bg={card.color}
          borderRadius="12px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Icon size={24} color="white" />
        </Box>
      </Flex>
    </Box>
  )
}

export default function MessaDashboard() {
  const [permissions, setPermissions] = useState<UserPermissions | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const fetchPermissions = async () => {
      try {
        const res = await fetch('/api/user/permissions', { signal: controller.signal })
        if (res.ok) {
          setPermissions(await res.json())
        } else {
          setPermissions({ permissions: [], isAdmin: false, userId: 'dev-user' })
        }
      } catch {
        setPermissions({ permissions: [], isAdmin: false, userId: 'dev-user' })
      } finally {
        setLoading(false)
        clearTimeout(timeoutId)
      }
    }

    fetchPermissions()
    return () => {
      controller.abort()
      clearTimeout(timeoutId)
    }
  }, [])

  const hasPermission = (permission: string) => {
    if (!permissions) return false
    return permissions.isAdmin || permissions.permissions.includes(permission)
  }

  const cards: MessaCardData[] = [
    {
      path: '/messa/workspaces',
      title: 'Workspaces',
      description: 'Espaces de travail',
      icon: FiPackage,
      color: 'purple.500',
      permission: PERMISSIONS.MESSA_WORKSPACES_VIEW,
    },
    {
      path: '/messa/templates',
      title: 'Templates',
      description: 'Modèles réutilisables',
      icon: FiFileText,
      color: 'blue.500',
      permission: PERMISSIONS.MESSA_TEMPLATES_VIEW,
    },
    {
      path: '/messa/post-versions',
      title: 'Versions',
      description: 'Variantes par plateforme',
      icon: FiLayers,
      color: 'green.500',
      permission: PERMISSIONS.MESSA_POST_VERSIONS_VIEW,
    },
    {
      path: '/messa/queues',
      title: 'Queues',
      description: 'Planification',
      icon: FiList,
      color: 'orange.500',
      permission: PERMISSIONS.MESSA_QUEUES_VIEW,
    },
    {
      path: '/messa/hashtag-groups',
      title: 'Hashtags',
      description: 'Groupes de hashtags',
      icon: FiHash,
      color: 'pink.500',
      permission: PERMISSIONS.MESSA_HASHTAG_GROUPS_VIEW,
    },
    {
      path: '/messa/dynamic-variables',
      title: 'Variables',
      description: 'Variables dynamiques',
      icon: FiCode,
      color: 'teal.500',
      permission: PERMISSIONS.MESSA_DYNAMIC_VARIABLES_VIEW,
    },
  ]

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="400px">
        <Spinner size="xl" color="purple.500" />
      </Flex>
    )
  }

  const visible = cards.filter((c) => hasPermission(c.permission))

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" color="text.primary" mb={6}>
        Messa
      </Text>
      {visible.length === 0 ? (
        <Box
          bg="rgba(18, 18, 26, 0.6)"
          backdropFilter="blur(10px)"
          border="1px solid"
          borderColor="rgba(255, 255, 255, 0.1)"
          borderRadius="16px"
          p={8}
          textAlign="center"
        >
          <Text fontSize="lg" fontWeight="bold" color="text.primary" mb={2}>
            Accès non configuré
          </Text>
          <Text color="text.secondary">
            Vos permissions Messa ne sont pas encore configurées.
          </Text>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap="24px">
          {visible.map((c) => (
            <MessaCard key={c.path} card={c} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  )
}



'use client'

import {
  SimpleGrid,
  Flex,
  Box,
  Text,
  Spinner,
} from '@chakra-ui/react'
import { FiVideo, FiFileText, FiCalendar, FiEdit3, FiUsers, FiShield, FiCreditCard, FiSettings, FiLayout, FiAlertCircle, FiPackage, FiLifeBuoy } from 'react-icons/fi'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import StatsWidgetChakra from '@/components/client/dashboard/StatsWidgetChakra'
import QuickNotesWidgetChakra from '@/components/client/dashboard/QuickNotesWidgetChakra'
import { PERMISSIONS } from '@/lib/permissions'
import { logger } from '@/lib/logger'

interface UserPermissions {
  permissions: string[]
  isAdmin: boolean
  userId: string
}

interface CardData {
  path: string
  label: string
  title: string
  description: string
  iconKey: string
  bgColor: string
  permission: string
}

// Composant pour rendre une carte individuelle - Utilise Box au lieu de Card pour Chakra UI v3
function DashboardCard({ card }: { card: CardData }) {
  const router = useRouter()
  
  // Mapping direct des icônes - méthode la plus sûre
  const getIcon = () => {
    switch (card.iconKey) {
      case 'video':
        return <FiVideo size={24} color="white" />
      case 'fileText':
        return <FiFileText size={24} color="white" />
      case 'calendar':
        return <FiCalendar size={24} color="white" />
      case 'edit':
        return <FiEdit3 size={24} color="white" />
      case 'users':
        return <FiUsers size={24} color="white" />
      case 'shield':
        return <FiShield size={24} color="white" />
      case 'creditCard':
        return <FiCreditCard size={24} color="white" />
      case 'layout':
        return <FiLayout size={24} color="white" />
      case 'alertCircle':
        return <FiAlertCircle size={24} color="white" />
      case 'settings':
        return <FiSettings size={24} color="white" />
      case 'package':
        return <FiPackage size={24} color="white" />
      case 'lifeBuoy':
        return <FiLifeBuoy size={24} color="white" />
      default:
        return null
    }
  }

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
        borderColor: 'rgba(147, 51, 234, 0.3)'
      }}
      transition="all 0.3s"
    >
      <Flex flexDirection="row" align="center" justify="space-between" w="100%">
        <Box>
          <Text fontSize="sm" color="text.tertiary" fontWeight="bold" pb="2px">
            {card.label}
          </Text>
          <Text fontSize="2xl" color="text.primary" fontWeight="bold">
            {card.title}
          </Text>
          <Text color="text.secondary" fontSize="xs" mt={2}>
            {card.description}
          </Text>
        </Box>
        <Box
          h="45px"
          w="45px"
          bg={card.bgColor}
          borderRadius="12px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {getIcon()}
        </Box>
      </Flex>
    </Box>
  )
}

export default function DashboardContent() {
  const [permissions, setPermissions] = useState<UserPermissions | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    logger.info('DashboardContent', 'Composant monté, début du chargement des permissions')
  }, [])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    let isMounted = true

    const fetchPermissions = async () => {
      logger.debug('DashboardContent', 'Début de fetchPermissions')
      try {
        // Timeout de 5 secondes pour éviter les chargements infinis
        const controller = new AbortController()
        timeoutId = setTimeout(() => {
          logger.warn('DashboardContent', 'Timeout lors de la récupération des permissions')
          controller.abort()
        }, 5000)

        logger.debug('DashboardContent', 'Appel API /api/user/permissions')
        const response = await fetch('/api/user/permissions', {
          signal: controller.signal,
        })
        
        if (!isMounted) {
          logger.debug('DashboardContent', 'Composant démonté, arrêt du traitement')
          return
        }

        logger.debug('DashboardContent', 'Réponse API reçue', { ok: response.ok, status: response.status })

        if (response.ok) {
          const data = await response.json()
          logger.info('DashboardContent', 'Permissions récupérées avec succès', {
            permissionsCount: data.permissions?.length || 0,
            isAdmin: data.isAdmin,
          })
          setPermissions(data)
        } else {
          // Si l'API échoue, donner des permissions par défaut pour permettre l'affichage
          logger.warn('DashboardContent', 'API permissions non disponible, utilisation des permissions par défaut', {
            status: response.status,
          })
          setPermissions({
            permissions: [
              PERMISSIONS.IDEAS_VIEW,
              PERMISSIONS.SCRIPTS_VIEW,
              PERMISSIONS.CALENDAR_VIEW,
              PERMISSIONS.NOTES_VIEW,
            ],
            isAdmin: false,
            userId: 'dev-user',
          })
        }
      } catch (error: any) {
        if (!isMounted) {
          logger.debug('DashboardContent', 'Composant démonté pendant le traitement d\'erreur')
          return
        }
        
        // Ignorer les erreurs d'abort (timeout)
        if (error.name === 'AbortError') {
          logger.warn('DashboardContent', 'Timeout lors de la récupération des permissions, utilisation des permissions par défaut')
        } else {
          logger.error('DashboardContent', error)
        }
        
        // En cas d'erreur, donner des permissions par défaut pour permettre l'affichage
        setPermissions({
          permissions: [
            PERMISSIONS.IDEAS_VIEW,
            PERMISSIONS.SCRIPTS_VIEW,
            PERMISSIONS.CALENDAR_VIEW,
            PERMISSIONS.NOTES_VIEW,
          ],
          isAdmin: false,
          userId: 'dev-user',
        })
      } finally {
        if (isMounted) {
          logger.debug('DashboardContent', 'Fin du chargement des permissions, setLoading(false)')
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

  const hasPermission = (permission: string) => {
    if (!permissions) return false
    if (permissions.isAdmin) return true
    return permissions.permissions.includes(permission)
  }

  const clientCards: CardData[] = [
    {
      path: '/ideas',
      label: 'Idées Vidéos',
      title: 'Nouvelle idée',
      description: 'Enregistrez une nouvelle idée',
      iconKey: 'video',
      bgColor: 'purple.500',
      permission: PERMISSIONS.IDEAS_VIEW,
    },
    {
      path: '/scripts',
      label: 'Scripts',
      title: 'Mes Scripts',
      description: 'Gérer vos scripts',
      iconKey: 'fileText',
      bgColor: 'purple.400',
      permission: PERMISSIONS.SCRIPTS_VIEW,
    },
    {
      path: '/calendar',
      label: 'Calendrier',
      title: 'Éditorial',
      description: 'Planifiez vos vidéos',
      iconKey: 'calendar',
      bgColor: 'gold.500',
      permission: PERMISSIONS.CALENDAR_VIEW,
    },
    {
      path: '/notes',
      label: 'Notes',
      title: 'Notes rapides',
      description: 'Capturez vos pensées',
      iconKey: 'edit',
      bgColor: 'purple.600',
      permission: PERMISSIONS.NOTES_VIEW,
    },
    {
      path: '/messa',
      label: 'Messa',
      title: 'Messa',
      description: 'Accédez à votre système Messa',
      iconKey: 'package',
      bgColor: 'blue.500',
      permission: PERMISSIONS.MESSA_ACCESS,
    },
    {
      path: '/helpdesk/new',
      label: 'Support',
      title: 'Créer un ticket',
      description: 'Contactez le support via Helpdesk',
      iconKey: 'lifeBuoy',
      bgColor: 'purple.500',
      permission: PERMISSIONS.HELPDESK_TICKETS_CREATE,
    },
    {
      path: '/subscriptions',
      label: 'Abonnements',
      title: 'Mes abonnements',
      description: 'Voir les abonnements (FOSSBilling)',
      iconKey: 'creditCard',
      bgColor: 'orange.500',
      permission: PERMISSIONS.FOSSBILLING_SUBSCRIPTIONS_VIEW,
    },
  ]

  const adminCards: CardData[] = [
    {
      path: '/admin/users',
      label: 'Utilisateurs',
      title: 'Gérer les utilisateurs',
      description: 'Voir et gérer tous les utilisateurs',
      iconKey: 'users',
      bgColor: 'blue.500',
      permission: PERMISSIONS.ADMIN_USERS,
    },
    {
      path: '/integrations/keycloak',
      label: 'Keycloak (Rôles)',
      title: 'Gestion des rôles (Keycloak)',
      description: 'Accéder à Keycloak Admin Console',
      iconKey: 'shield',
      bgColor: 'green.500',
      permission: PERMISSIONS.ADMIN_USERS,
    },
    {
      path: '/admin/cms',
      label: 'CMS',
      title: 'Gestion du contenu',
      description: 'Modifier les pages publiques',
      iconKey: 'layout',
      bgColor: 'pink.500',
      permission: PERMISSIONS.ADMIN_CMS,
    },
    {
      path: '/integrations/helpdesk',
      label: 'Helpdesk',
      title: 'Dashboard Helpdesk',
      description: 'Accéder au Helpdesk (agents/admin)',
      iconKey: 'lifeBuoy',
      bgColor: 'purple.500',
      permission: PERMISSIONS.HELPDESK_ADMIN,
    },
    {
      path: '/integrations/fossbilling',
      label: 'FOSSBilling',
      title: 'Dashboard FOSSBilling',
      description: 'Accéder au billing (staff/admin)',
      iconKey: 'creditCard',
      bgColor: 'orange.500',
      permission: PERMISSIONS.FOSSBILLING_ADMIN,
    },
    {
      path: '/admin/logs',
      label: 'Logs d\'Erreurs',
      title: 'Erreurs système',
      description: 'Voir les logs d\'erreurs',
      iconKey: 'alertCircle',
      bgColor: 'red.500',
      permission: PERMISSIONS.ADMIN_LOGS,
    },
    {
      path: '/admin/settings',
      label: 'Paramètres',
      title: 'Configuration',
      description: 'Paramètres du système',
      iconKey: 'settings',
      bgColor: 'gray.500',
      permission: PERMISSIONS.ADMIN_ACCESS,
    },
  ]

  if (loading) {
    logger.debug('DashboardContent', 'Affichage du spinner de chargement')
    return (
      <Flex justify="center" align="center" minH="400px">
        <Spinner size="xl" color="purple.500" />
      </Flex>
    )
  }

  logger.info('DashboardContent', 'Rendu du contenu du dashboard', {
    hasPermissions: !!permissions,
    permissionsCount: permissions?.permissions?.length || 0,
  })

  const visibleClientCards = clientCards.filter(card => hasPermission(card.permission))
  const visibleAdminCards = adminCards.filter(card => hasPermission(card.permission))
  
  logger.debug('DashboardContent', 'Cartes filtrées', {
    visibleClientCards: visibleClientCards.length,
    visibleAdminCards: visibleAdminCards.length,
  })

  // Si aucune carte n'est visible, afficher un message
  if (!loading && visibleClientCards.length === 0 && visibleAdminCards.length === 0) {
    return (
      <Box>
        <Box
          bg="rgba(18, 18, 26, 0.6)"
          backdropFilter="blur(10px)"
          border="1px solid"
          borderColor="rgba(255, 255, 255, 0.1)"
          borderRadius="16px"
          p={8}
          textAlign="center"
          mb={8}
        >
          <Text fontSize="xl" fontWeight="bold" color="text.primary" mb={2}>
            Bienvenue sur votre tableau de bord
          </Text>
          <Text color="text.secondary" mb={4}>
            Vous n&apos;avez pas encore de permissions configurées. Contactez un administrateur pour obtenir l&apos;accès aux fonctionnalités.
          </Text>
        </Box>
        <Box mb="24px">
          <StatsWidgetChakra />
        </Box>
        <Box>
          <QuickNotesWidgetChakra />
        </Box>
      </Box>
    )
  }

  return (
    <Box>
      {/* Section Outils Client - Toujours visible pour tous */}
      {visibleClientCards.length > 0 && (
        <Box mb={8}>
          <Text fontSize="2xl" fontWeight="bold" color="text.primary" mb={6}>
            Mes Outils
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap="24px">
            {visibleClientCards.map((card) => (
              <DashboardCard key={card.path} card={card} />
            ))}
          </SimpleGrid>
        </Box>
      )}

      {/* Widgets Statistiques et Notes */}
      <Box mb="24px">
        <StatsWidgetChakra />
      </Box>

      <Box>
        <QuickNotesWidgetChakra />
      </Box>

      {/* Section Administration (en bas) - Visible uniquement si permissions admin via rôles */}
      {visibleAdminCards.length > 0 && (
        <Box mt={8} id="admin-section">
          <Text fontSize="2xl" fontWeight="bold" color="text.primary" mb={6}>
            Administration
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap="24px">
            {visibleAdminCards.map((card) => (
              <DashboardCard key={card.path} card={card} />
            ))}
          </SimpleGrid>
        </Box>
      )}
    </Box>
  )
}

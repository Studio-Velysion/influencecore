'use client'

import { Box, Flex, Spinner, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

export default function FossSubscriptionsView() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/fossbilling/subscriptions', { cache: 'no-store' })
        const json = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(json?.error || 'Erreur lors du chargement')
        if (mounted) setData(json)
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Erreur')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="300px">
        <Spinner size="xl" color="purple.500" />
      </Flex>
    )
  }

  if (error) {
    return (
      <Box p={6} borderRadius="16px" bg="rgba(239, 68, 68, 0.12)" border="1px solid rgba(239, 68, 68, 0.25)">
        <Text color="red.300" fontWeight="bold" mb={1}>
          Impossible de charger les abonnements
        </Text>
        <Text color="text.secondary" fontSize="sm">
          {error}
        </Text>
      </Box>
    )
  }

  const list: any[] = data?.list || []

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" color="text.primary" mb={2}>
        Abonnements (FOSSBilling)
      </Text>
      <Text color="text.secondary" mb={6}>
        Données synchronisées en temps réel via l’API FOSSBilling.
      </Text>

      <Box
        bg="rgba(18, 18, 26, 0.6)"
        backdropFilter="blur(10px)"
        border="1px solid"
        borderColor="rgba(255, 255, 255, 0.1)"
        borderRadius="16px"
        p={6}
      >
        {list.length === 0 ? (
          <Text color="text.secondary">Aucun abonnement.</Text>
        ) : (
          <Box as="table" w="100%" style={{ borderCollapse: 'collapse' }}>
            <Box as="thead">
              <Box as="tr">
                <Box as="th" textAlign="left" py={2} color="text.tertiary" fontSize="sm">
                  ID
                </Box>
                <Box as="th" textAlign="left" py={2} color="text.tertiary" fontSize="sm">
                  Statut
                </Box>
                <Box as="th" textAlign="left" py={2} color="text.tertiary" fontSize="sm">
                  Montant
                </Box>
                <Box as="th" textAlign="left" py={2} color="text.tertiary" fontSize="sm">
                  Devise
                </Box>
              </Box>
            </Box>
            <Box as="tbody">
              {list.map((s) => (
                <Box as="tr" key={String(s.id)} borderTop="1px solid rgba(255,255,255,0.06)">
                  <Box as="td" py={2} color="text.primary">
                    {s.id}
                  </Box>
                  <Box as="td" py={2} color="text.secondary">
                    {s.status || '-'}
                  </Box>
                  <Box as="td" py={2} color="text.secondary">
                    {s.amount || '-'}
                  </Box>
                  <Box as="td" py={2} color="text.secondary">
                    {s.currency || '-'}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}



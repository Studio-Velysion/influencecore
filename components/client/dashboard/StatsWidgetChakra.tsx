'use client'

import { useState, useEffect } from 'react'
import {
  SimpleGrid,
  Box,
  Text,
  Progress,
  Flex,
  Spinner,
} from '@chakra-ui/react'
import { VideoIdea } from '@/types/ideas'
import { VideoScript } from '@/types/scripts'
import { QuickNote } from '@/types/notes'
import { formatNumber } from '@/lib/utils'

interface Stats {
  totalIdeas: number
  ideasByStatus: Record<string, number>
  totalScripts: number
  totalNotes: number
  ideasWithTargetDate: number
}

export default function StatsWidgetChakra() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [ideasRes, scriptsRes, notesRes] = await Promise.all([
        fetch('/api/ideas'),
        fetch('/api/scripts'),
        fetch('/api/notes'),
      ])

      const ideas: VideoIdea[] = ideasRes.ok ? await ideasRes.json() : []
      const scripts: VideoScript[] = scriptsRes.ok ? await scriptsRes.json() : []
      const notes: QuickNote[] = notesRes.ok ? await notesRes.json() : []

      const ideasByStatus: Record<string, number> = {}
      ideas.forEach((idea) => {
        ideasByStatus[idea.status] = (ideasByStatus[idea.status] || 0) + 1
      })

      setStats({
        totalIdeas: ideas.length,
        ideasByStatus,
        totalScripts: scripts.length,
        totalNotes: notes.length,
        ideasWithTargetDate: ideas.filter((idea) => idea.targetDate).length,
      })
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box
        bg="rgba(18, 18, 26, 0.6)"
        backdropFilter="blur(10px)"
        border="1px solid"
        borderColor="rgba(255, 255, 255, 0.1)"
        borderRadius="16px"
        p={6}
      >
        <Flex justifyContent="center" alignItems="center" py={8}>
          <Spinner size="xl" color="purple.500" />
        </Flex>
      </Box>
    )
  }

  if (!stats) return null

  return (
    <Box
      bg="rgba(18, 18, 26, 0.6)"
      backdropFilter="blur(10px)"
      border="1px solid"
      borderColor="rgba(255, 255, 255, 0.1)"
      borderRadius="16px"
      p={6}
    >
      <Box mb={4}>
        <Text fontSize="lg" fontWeight="bold" color="text.primary">
          Statistiques
        </Text>
      </Box>
      <Box>
        <SimpleGrid columns={{ base: 2, md: 4 }} gap={4} mb={6}>
          <Box textAlign="center" p={4} borderRadius="lg" bg="bg.tertiary" border="1px solid" borderColor="rgba(255,255,255,0.1)">
            <Text fontSize="2xl" fontWeight="bold" bgGradient="linear(to-r, purple.400, pink.400)" bgClip="text">
              {formatNumber(stats.totalIdeas)}
            </Text>
            <Text fontSize="sm" color="text.tertiary" mt={1}>Idées</Text>
          </Box>
          <Box textAlign="center" p={4} borderRadius="lg" bg="bg.tertiary" border="1px solid" borderColor="rgba(255,255,255,0.1)">
            <Text fontSize="2xl" fontWeight="bold" color="purple.400">
              {formatNumber(stats.totalScripts)}
            </Text>
            <Text fontSize="sm" color="text.tertiary" mt={1}>Scripts</Text>
          </Box>
          <Box textAlign="center" p={4} borderRadius="lg" bg="bg.tertiary" border="1px solid" borderColor="rgba(255,255,255,0.1)">
            <Text fontSize="2xl" fontWeight="bold" color="purple.300">
              {formatNumber(stats.totalNotes)}
            </Text>
            <Text fontSize="sm" color="text.tertiary" mt={1}>Notes</Text>
          </Box>
          <Box textAlign="center" p={4} borderRadius="lg" bg="bg.tertiary" border="1px solid" borderColor="rgba(255,255,255,0.1)">
            <Text fontSize="2xl" fontWeight="bold" color="gold.400">
              {formatNumber(stats.ideasWithTargetDate)}
            </Text>
            <Text fontSize="sm" color="text.tertiary" mt={1}>Programmées</Text>
          </Box>
        </SimpleGrid>

        {Object.keys(stats.ideasByStatus).length > 0 && (
          <Box mt={6} pt={6} borderTop="1px solid" borderColor="rgba(255,255,255,0.1)">
            <Text fontSize="sm" fontWeight="medium" color="text.secondary" mb={3}>
              Répartition par statut
            </Text>
            <Flex direction="column" gap={2}>
              {Object.entries(stats.ideasByStatus).map(([status, count]) => (
                <Flex key={status} alignItems="center" justifyContent="space-between">
                  <Text fontSize="sm" color="text.tertiary">{status}</Text>
                  <Flex alignItems="center" gap={2}>
                    <Box w="96px" bg="bg.tertiary" borderRadius="full" h="8px" border="1px solid" borderColor="rgba(255,255,255,0.1)">
                      <Progress
                        value={(count / stats.totalIdeas) * 100}
                        colorPalette="purple"
                        bg="transparent"
                        borderRadius="full"
                        h="100%"
                        sx={{
                          '& > div': {
                            background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
                          },
                        }}
                      />
                    </Box>
                    <Text fontSize="sm" fontWeight="medium" color="text.primary" w="32px" textAlign="right">
                      {count}
                    </Text>
                  </Flex>
                </Flex>
              ))}
            </Flex>
          </Box>
        )}
      </Box>
    </Box>
  )
}


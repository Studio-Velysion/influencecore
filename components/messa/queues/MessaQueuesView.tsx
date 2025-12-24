'use client'

import { Box, Button, Flex, Input, Text, Spinner } from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react'

type Queue = {
  id: string
  name: string
  isActive?: boolean
  schedule?: { times: string[]; days: string[] }
}

const DEFAULT_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
const DEFAULT_TIMES = ['09:00']

export default function MessaQueuesView() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [queues, setQueues] = useState<Queue[]>([])

  const [name, setName] = useState('')
  const canCreate = useMemo(() => name.trim().length > 0, [name])

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/messa/queues', { cache: 'no-store' as any })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Erreur API')
      setQueues(Array.isArray(data?.queues) ? data.queues : data)
    } catch (e: any) {
      setError(e?.message ?? 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const createQueue = async () => {
    setError(null)
    try {
      const res = await fetch('/api/messa/queues', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          schedule: { days: DEFAULT_DAYS, times: DEFAULT_TIMES },
          isActive: true,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Erreur création')
      setName('')
      await load()
    } catch (e: any) {
      setError(e?.message ?? 'Erreur')
    }
  }

  const deleteQueue = async (id: string) => {
    if (!confirm('Supprimer cette queue ?')) return
    setError(null)
    try {
      const res = await fetch(`/api/messa/queues/${encodeURIComponent(id)}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Erreur suppression')
      await load()
    } catch (e: any) {
      setError(e?.message ?? 'Erreur')
    }
  }

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="300px">
        <Spinner size="xl" color="purple.500" />
      </Flex>
    )
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4} gap={4} flexWrap="wrap">
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="text.primary">
            Messa — Queues
          </Text>
          <Text color="text.secondary">Files de publication (schedule jours/heures).</Text>
        </Box>
        <Button onClick={load} variant="outline">
          Rafraîchir
        </Button>
      </Flex>

      {error && (
        <Box mb={4} p={3} borderRadius="12px" border="1px solid" borderColor="red.500" bg="rgba(255,0,0,0.08)">
          <Text color="red.200">{error}</Text>
        </Box>
      )}

      <Box
        mb={6}
        p={4}
        borderRadius="16px"
        bg="rgba(18, 18, 26, 0.6)"
        border="1px solid"
        borderColor="rgba(255, 255, 255, 0.1)"
      >
        <Text fontWeight="bold" color="text.primary" mb={3}>
          Créer une queue
        </Text>
        <Flex gap={3} flexWrap="wrap">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom" maxW="320px" />
          <Button colorScheme="purple" onClick={createQueue} isDisabled={!canCreate}>
            Créer (lun-ven 09:00)
          </Button>
        </Flex>
      </Box>

      <Box
        bg="rgba(18, 18, 26, 0.6)"
        backdropFilter="blur(10px)"
        border="1px solid"
        borderColor="rgba(255, 255, 255, 0.1)"
        borderRadius="16px"
        overflow="hidden"
      >
        <Box as="table" width="100%" style={{ borderCollapse: 'collapse' }}>
          <Box as="thead" bg="rgba(255,255,255,0.04)">
            <Box as="tr">
              <Box as="th" textAlign="left" p={3} color="text.secondary" fontWeight="600">
                Nom
              </Box>
              <Box as="th" textAlign="left" p={3} color="text.secondary" fontWeight="600">
                Schedule
              </Box>
              <Box as="th" textAlign="right" p={3} color="text.secondary" fontWeight="600">
                Actions
              </Box>
            </Box>
          </Box>
          <Box as="tbody">
            {queues.length === 0 ? (
              <Box as="tr">
                <Box as="td" p={4} colSpan={3 as any}>
                  <Text color="text.secondary">Aucune queue.</Text>
                </Box>
              </Box>
            ) : (
              queues.map((q) => (
                <Box as="tr" key={q.id} borderTop="1px solid" borderColor="rgba(255,255,255,0.06)">
                  <Box as="td" p={3} color="text.primary" fontWeight="600">
                    {q.name}
                  </Box>
                  <Box as="td" p={3} color="text.secondary">
                    {(q.schedule?.days ?? []).join(', ') || '—'} · {(q.schedule?.times ?? []).join(', ') || '—'}
                  </Box>
                  <Box as="td" p={3} textAlign="right">
                    <Button size="sm" colorScheme="red" variant="outline" onClick={() => deleteQueue(q.id)}>
                      Supprimer
                    </Button>
                  </Box>
                </Box>
              ))
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}



'use client'

import { Box, Button, Flex, Input, Text, Spinner } from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react'

type Workspace = {
  id: string
  name: string
  description?: string | null
  createdAt?: string
  _count?: {
    posts?: number
    integrations?: number
    media?: number
  }
}

export default function MessaWorkspacesView() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const canCreate = useMemo(() => name.trim().length > 0, [name])

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/messa/workspaces', { cache: 'no-store' as any })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Erreur API')
      setWorkspaces(Array.isArray(data?.workspaces) ? data.workspaces : data)
    } catch (e: any) {
      setError(e?.message ?? 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const createWorkspace = async () => {
    setError(null)
    try {
      const res = await fetch('/api/messa/workspaces', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), description: description.trim() || undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Erreur création')
      setName('')
      setDescription('')
      await load()
    } catch (e: any) {
      setError(e?.message ?? 'Erreur')
    }
  }

  const deleteWorkspace = async (id: string) => {
    if (!confirm('Supprimer ce workspace ?')) return
    setError(null)
    try {
      const res = await fetch(`/api/messa/workspaces/${encodeURIComponent(id)}`, { method: 'DELETE' })
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
            Messa — Workspaces
          </Text>
          <Text color="text.secondary">Tes espaces de travail (Postiz engine, UI InfluenceCore).</Text>
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
          Créer un workspace
        </Text>
        <Flex gap={3} flexWrap="wrap">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom du workspace"
            maxW="360px"
          />
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optionnel)"
            maxW="520px"
          />
          <Button colorPalette="purple" onClick={createWorkspace} disabled={!canCreate}>
            Créer
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
                Description
              </Box>
              <Box as="th" textAlign="right" p={3} color="text.secondary" fontWeight="600">
                Actions
              </Box>
            </Box>
          </Box>
          <Box as="tbody">
            {workspaces.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: 16 }}>
                  <Text color="text.secondary">Aucun workspace.</Text>
                </td>
              </tr>
            ) : (
              workspaces.map((w) => (
                <Box as="tr" key={w.id} borderTop="1px solid" borderColor="rgba(255,255,255,0.06)">
                  <Box as="td" p={3} color="text.primary" fontWeight="600">
                    {w.name}
                  </Box>
                  <Box as="td" p={3} color="text.secondary">
                    {w.description || '—'}
                  </Box>
                  <Box as="td" p={3} textAlign="right">
                    <Button size="sm" colorPalette="red" variant="outline" onClick={() => deleteWorkspace(w.id)}>
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



'use client'

import { Box, Button, Flex, Input, Text, Textarea, Spinner } from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react'

type Template = {
  id: string
  name: string
  description?: string | null
  content?: any
  createdAt?: string
}

export default function MessaTemplatesView() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [templates, setTemplates] = useState<Template[]>([])

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [body, setBody] = useState('')

  const canCreate = useMemo(() => name.trim().length > 0 && body.trim().length > 0, [name, body])

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/messa/templates', { cache: 'no-store' as any })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Erreur API')
      setTemplates(Array.isArray(data?.templates) ? data.templates : data)
    } catch (e: any) {
      setError(e?.message ?? 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const createTemplate = async () => {
    setError(null)
    try {
      const res = await fetch('/api/messa/templates', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
          content: { body: body.trim() },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Erreur création')
      setName('')
      setDescription('')
      setBody('')
      await load()
    } catch (e: any) {
      setError(e?.message ?? 'Erreur')
    }
  }

  const deleteTemplate = async (id: string) => {
    if (!confirm('Supprimer ce template ?')) return
    setError(null)
    try {
      const res = await fetch(`/api/messa/templates/${encodeURIComponent(id)}`, { method: 'DELETE' })
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
            Messa — Templates
          </Text>
          <Text color="text.secondary">Modèles (texte) que tu réutilises pour publier.</Text>
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
          Créer un template
        </Text>
        <Flex gap={3} flexWrap="wrap">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom" maxW="320px" />
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optionnel)"
            maxW="520px"
          />
        </Flex>
        <Box mt={3}>
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Contenu (body)..." minH="140px" />
        </Box>
        <Flex justify="flex-end" mt={3}>
          <Button colorScheme="purple" onClick={createTemplate} isDisabled={!canCreate}>
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
            {templates.length === 0 ? (
              <Box as="tr">
                <Box as="td" p={4} colSpan={3 as any}>
                  <Text color="text.secondary">Aucun template.</Text>
                </Box>
              </Box>
            ) : (
              templates.map((t) => (
                <Box as="tr" key={t.id} borderTop="1px solid" borderColor="rgba(255,255,255,0.06)">
                  <Box as="td" p={3} color="text.primary" fontWeight="600">
                    {t.name}
                  </Box>
                  <Box as="td" p={3} color="text.secondary">
                    {t.description || '—'}
                  </Box>
                  <Box as="td" p={3} textAlign="right">
                    <Button size="sm" colorScheme="red" variant="outline" onClick={() => deleteTemplate(t.id)}>
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



'use client'

import { Box, Button, Flex, Text, Input, Textarea } from '@chakra-ui/react'
import { useState } from 'react'

export default function NewTicketForm() {
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ id?: string; name?: string } | null>(null)

  const submit = async () => {
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      const res = await fetch('/api/helpdesk/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, description }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.error || 'Erreur lors de la création du ticket')
      }
      setSuccess({ id: data?.ticket?.name, name: data?.ticket?.name })
      setSubject('')
      setDescription('')
    } catch (e: any) {
      setError(e?.message || 'Erreur')
    } finally {
      setLoading(false)
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
      maxW="720px"
    >
      <Text fontSize="2xl" fontWeight="bold" color="text.primary" mb={2}>
        Créer un ticket
      </Text>
      <Text color="text.secondary" mb={6}>
        Décris ton problème et on crée un ticket dans Helpdesk.
      </Text>

      {error && (
        <Box mb={4} p={3} borderRadius="12px" bg="rgba(239, 68, 68, 0.12)" border="1px solid rgba(239, 68, 68, 0.25)">
          <Text color="red.300" fontSize="sm">
            {error}
          </Text>
        </Box>
      )}

      {success && (
        <Box mb={4} p={3} borderRadius="12px" bg="rgba(34, 197, 94, 0.12)" border="1px solid rgba(34, 197, 94, 0.25)">
          <Text color="green.300" fontSize="sm">
            Ticket créé: {success.name}
          </Text>
        </Box>
      )}

      <Flex direction="column" gap={4}>
        <Box>
          <Text fontSize="sm" color="text.tertiary" mb={2} fontWeight="bold">
            Sujet
          </Text>
          <Input
            value={subject}
            onChange={(e: any) => setSubject(e.target.value)}
            placeholder="Ex: Problème de connexion"
            bg="rgba(255, 255, 255, 0.04)"
            borderColor="rgba(255, 255, 255, 0.1)"
          />
        </Box>
        <Box>
          <Text fontSize="sm" color="text.tertiary" mb={2} fontWeight="bold">
            Description
          </Text>
          <Textarea
            value={description}
            onChange={(e: any) => setDescription(e.target.value)}
            placeholder="Donne un maximum de détails…"
            minH="160px"
            bg="rgba(255, 255, 255, 0.04)"
            borderColor="rgba(255, 255, 255, 0.1)"
          />
        </Box>

        <Flex justify="flex-end" gap={3}>
          <Button
            onClick={submit}
            loading={loading}
            bg="purple.500"
            _hover={{ bg: 'purple.600' }}
            color="white"
          >
            Envoyer
          </Button>
        </Flex>
      </Flex>
    </Box>
  )
}



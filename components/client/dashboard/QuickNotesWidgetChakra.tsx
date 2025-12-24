'use client'

import { useState } from 'react'
import {
  Box,
  Button,
  Textarea,
  Text,
  Flex,
} from '@chakra-ui/react'
import toast from 'react-hot-toast'

export default function QuickNotesWidgetChakra() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
        }),
      })

      if (response.ok) {
        setContent('')
        toast.success('Note enregistrée avec succès')
      } else {
        toast.error('Erreur lors de l\'enregistrement')
      }
    } catch (err) {
      toast.error('Une erreur est survenue lors de l\'enregistrement')
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
    >
      <Box mb={4}>
        <Text fontSize="lg" fontWeight="bold" color="text.primary">
          Notes instantanées
        </Text>
      </Box>
      <Box>
        <form onSubmit={handleSubmit}>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            bg="bg.tertiary"
            border="1px solid"
            borderColor="rgba(255,255,255,0.1)"
            color="text.primary"
            placeholder="Écrivez une note rapide..."
            _focus={{
              borderColor: 'purple.500',
              boxShadow: '0 0 0 1px rgba(147, 51, 234, 0.2)',
            }}
            _placeholder={{
              color: 'text.muted',
            }}
          />
          <Flex justifyContent="space-between" alignItems="center" mt={4}>
            <Button
              type="submit"
              isLoading={loading}
              loadingText="Enregistrement..."
              isDisabled={!content.trim()}
              colorScheme="purple"
              variant="solid"
              bg="gold.500"
              color="text.inverse"
              _hover={{
                bg: 'gold.600',
              }}
            >
              Enregistrer
            </Button>
          </Flex>
        </form>
      </Box>
    </Box>
  )
}


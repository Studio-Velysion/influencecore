'use client'

import { Box, Text } from '@chakra-ui/react'

export default function ExternalIframe({ title, src }: { title: string; src: string }) {
  if (!src) {
    return (
      <Box p={6} borderRadius="16px" bg="rgba(239, 68, 68, 0.12)" border="1px solid rgba(239, 68, 68, 0.25)">
        <Text color="red.300" fontWeight="bold" mb={1}>
          Configuration manquante
        </Text>
        <Text color="text.secondary" fontSize="sm">
          URL manquante pour {title}.
        </Text>
      </Box>
    )
  }

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" color="text.primary" mb={4}>
        {title}
      </Text>
      <Box
        borderRadius="16px"
        overflow="hidden"
        border="1px solid"
        borderColor="rgba(255,255,255,0.1)"
        bg="rgba(18, 18, 26, 0.6)"
        backdropFilter="blur(10px)"
        h="75vh"
      >
        <iframe
          title={title}
          src={src}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        />
      </Box>
    </Box>
  )
}



'use client'

import { useEffect, useState } from 'react'
import { Box, Button, Text, Flex, Code } from '@chakra-ui/react'
import { logger } from '@/lib/logger'

export default function LogViewer() {
  const [logs, setLogs] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(logger.getLogs())
      setStats(logger.getStats())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleDownload = () => {
    logger.downloadLogs()
  }

  const handleClear = () => {
    logger.clear()
    setLogs([])
    setStats(null)
  }

  const handleShow = () => {
    logger.showLogs()
  }

  return (
    <Box
      position="fixed"
      bottom={4}
      right={4}
      bg="rgba(18, 18, 26, 0.95)"
      backdropFilter="blur(10px)"
      border="1px solid"
      borderColor="rgba(255, 255, 255, 0.1)"
      borderRadius="16px"
      p={4}
      maxW="400px"
      maxH="500px"
      overflowY="auto"
      zIndex={9999}
      boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)"
    >
      <Text fontSize="lg" fontWeight="bold" color="text.primary" mb={2}>
        📋 Logs de Débogage
      </Text>
      
      {stats && (
        <Box mb={4} p={2} bg="bg.tertiary" borderRadius="8px">
          <Text fontSize="xs" color="text.secondary">
            Total: {stats.total} | 
            Info: {stats.byLevel.info} | 
            Warn: {stats.byLevel.warn} | 
            Error: {stats.byLevel.error}
          </Text>
        </Box>
      )}

      <Flex gap={2} mb={4} flexWrap="wrap">
        <Button size="sm" onClick={handleShow} colorPalette="purple">
          Afficher
        </Button>
        <Button size="sm" onClick={handleDownload} colorPalette="blue">
          Télécharger
        </Button>
        <Button size="sm" onClick={handleClear} colorPalette="red">
          Effacer
        </Button>
      </Flex>

      <Box>
        {logs.slice(-10).reverse().map((log, index) => (
          <Box
            key={index}
            mb={2}
            p={2}
            bg="bg.tertiary"
            borderRadius="4px"
            fontSize="xs"
          >
            <Text color="text.tertiary" fontFamily="mono">
              [{log.timestamp.split('T')[1].split('.')[0]}] [{log.level}] [{log.component}]
            </Text>
            <Text color="text.secondary" mt={1}>
              {log.message}
            </Text>
            {log.data && (
              <Code fontSize="xs" mt={1} display="block" p={1}>
                {JSON.stringify(log.data, null, 2).slice(0, 100)}...
              </Code>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  )
}


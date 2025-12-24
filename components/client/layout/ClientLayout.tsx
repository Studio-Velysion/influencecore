'use client'

import { Box, Flex } from '@chakra-ui/react'
import ClientSidebar from './ClientSidebar'
import ClientNavbar from './ClientNavbar'
import ClientChakraProvider from './ClientChakraProvider'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientChakraProvider>
      <Box minH="100vh" bg="bg.primary" position="relative">
        <ClientSidebar />
        <Box
          ml={{ base: 0, xl: '275px' }}
          minH="100vh"
          pt={{ base: '120px', md: '100px' }}
          px={{ base: 4, md: 6 }}
          pb={8}
        >
          <ClientNavbar />
          {children}
        </Box>
      </Box>
    </ClientChakraProvider>
  )
}


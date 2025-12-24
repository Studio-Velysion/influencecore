'use client'

import { Box, Flex } from '@chakra-ui/react'
import AdminSidebarChakra from './AdminSidebarChakra'
import AdminNavbarChakra from './AdminNavbarChakra'
import ClientChakraProvider from '@/components/client/layout/ClientChakraProvider'

export default function AdminLayoutChakra({ children }: { children: React.ReactNode }) {
  return (
    <ClientChakraProvider>
      <Box minH="100vh" bg="bg.primary" position="relative">
        <AdminSidebarChakra />
        <Box
          ml={{ base: 0, xl: '275px' }}
          minH="100vh"
          pt={{ base: '120px', md: '100px' }}
          px={{ base: 4, md: 6 }}
          pb={8}
        >
          <AdminNavbarChakra />
          {children}
        </Box>
      </Box>
    </ClientChakraProvider>
  )
}


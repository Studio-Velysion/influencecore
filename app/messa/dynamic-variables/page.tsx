import ClientLayout from '@/components/client/layout/ClientLayout'
import AdminLayoutChakra from '@/components/admin/layout/AdminLayoutChakra'
import { getServerSessionWithTest } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Box, Text } from '@chakra-ui/react'

export default async function MessaDynamicVariablesPage() {
  const session = await getServerSessionWithTest()
  if (!session) redirect('/login')

  const isAdmin = session?.user?.isAdmin || false
  const Layout = isAdmin ? AdminLayoutChakra : ClientLayout

  return (
    <Layout>
      <Box>
        <Text fontSize="2xl" fontWeight="bold" color="text.primary" mb={2}>
          Messa — Dynamic Variables
        </Text>
        <Text color="text.secondary">
          (Placeholder) Variables dynamiques Messa.
        </Text>
      </Box>
    </Layout>
  )
}



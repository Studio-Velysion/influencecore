import { getServerSessionWithTest } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminLayout from '@/components/admin/layout/AdminLayout'
import GrapesJSEditor from '@/components/admin/cms/GrapesJSEditor'
import { Box, Text } from '@chakra-ui/react'

export default async function GrapesJSPage() {
  const session = await getServerSessionWithTest()
  
  if (!session) {
    redirect('/login')
  }

  // Vérifier que l'utilisateur est admin
  if (!session.user?.isAdmin) {
    redirect('/dashboard')
  }

  return (
    <AdminLayout>
      <Box p={6}>
        <Text fontSize="2xl" fontWeight="bold" color="text.primary" mb={6}>
          Éditeur GrapesJS
        </Text>
        <GrapesJSEditor pageType="homepage" />
      </Box>
    </AdminLayout>
  )
}


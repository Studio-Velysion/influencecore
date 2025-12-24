import ClientLayout from '@/components/client/layout/ClientLayout'
import AdminLayoutChakra from '@/components/admin/layout/AdminLayoutChakra'
import { getServerSessionWithTest } from '@/lib/auth'
import { redirect } from 'next/navigation'
import MessaTemplatesView from '@/components/messa/templates/MessaTemplatesView'

export default async function MessaTemplatesPage() {
  const session = await getServerSessionWithTest()
  if (!session) redirect('/login')

  const isAdmin = session?.user?.isAdmin || false
  const Layout = isAdmin ? AdminLayoutChakra : ClientLayout

  return (
    <Layout>
      <MessaTemplatesView />
    </Layout>
  )
}



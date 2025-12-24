import ClientLayout from '@/components/client/layout/ClientLayout'
import AdminLayoutChakra from '@/components/admin/layout/AdminLayoutChakra'
import { getServerSessionWithTest } from '@/lib/auth'
import { redirect } from 'next/navigation'
import MessaWorkspacesView from '@/components/messa/workspaces/MessaWorkspacesView'

export default async function MessaWorkspacesPage() {
  const session = await getServerSessionWithTest()
  if (!session) redirect('/login')

  const isAdmin = session?.user?.isAdmin || false
  const Layout = isAdmin ? AdminLayoutChakra : ClientLayout

  return (
    <Layout>
      <MessaWorkspacesView />
    </Layout>
  )
}



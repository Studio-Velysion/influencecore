import { getServerSessionWithTest } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ClientLayout from '@/components/client/layout/ClientLayout'
import AdminLayoutChakra from '@/components/admin/layout/AdminLayoutChakra'
import MessaDashboard from '@/components/messa/MessaDashboard'

export default async function MessaPage() {
  const session = await getServerSessionWithTest()

  if (!session) redirect('/login')

  const isAdmin = session?.user?.isAdmin || false
  const Layout = isAdmin ? AdminLayoutChakra : ClientLayout

  return (
    <Layout>
      <MessaDashboard />
    </Layout>
  )
}



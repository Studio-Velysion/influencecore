import { getServerSessionWithTest } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ClientLayout from '@/components/client/layout/ClientLayout'
import AdminLayoutChakra from '@/components/admin/layout/AdminLayoutChakra'
import FossSubscriptionsView from '@/components/fossbilling/FossSubscriptionsView'

export default async function SubscriptionsPage() {
  const session = await getServerSessionWithTest()

  if (!session) redirect('/login')

  const isAdmin = session?.user?.isAdmin || false
  const Layout = isAdmin ? AdminLayoutChakra : ClientLayout

  return (
    <Layout>
      <FossSubscriptionsView />
    </Layout>
  )
}



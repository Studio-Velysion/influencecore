import { getServerSessionWithTest } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ClientLayout from '@/components/client/layout/ClientLayout'
import AdminLayoutChakra from '@/components/admin/layout/AdminLayoutChakra'
import NewTicketForm from '@/components/helpdesk/NewTicketForm'

export default async function NewHelpdeskTicketPage() {
  const session = await getServerSessionWithTest()

  if (!session) redirect('/login')

  const isAdmin = session?.user?.isAdmin || false
  const Layout = isAdmin ? AdminLayoutChakra : ClientLayout

  return (
    <Layout>
      <NewTicketForm />
    </Layout>
  )
}



import { getServerSessionWithTest } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ClientLayout from '@/components/client/layout/ClientLayout'
import AdminLayoutChakra from '@/components/admin/layout/AdminLayoutChakra'
import ExternalIframe from '@/components/integrations/ExternalIframe'

export default async function HelpdeskIntegrationPage() {
  const session = await getServerSessionWithTest()
  if (!session) redirect('/login')

  const isAdmin = session?.user?.isAdmin || false
  const Layout = isAdmin ? AdminLayoutChakra : ClientLayout

  // URL du helpdesk (portail agents). Exemple: http://helpdesk.localhost:8000/helpdesk
  const src = process.env.NEXT_PUBLIC_HELPDESK_DASHBOARD_URL || ''

  return (
    <Layout>
      <ExternalIframe title="Helpdesk" src={src} />
    </Layout>
  )
}



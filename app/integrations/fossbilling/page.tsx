import { getServerSessionWithTest } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ClientLayout from '@/components/client/layout/ClientLayout'
import AdminLayoutChakra from '@/components/admin/layout/AdminLayoutChakra'
import ExternalIframe from '@/components/integrations/ExternalIframe'

export default async function FossbillingIntegrationPage() {
  const session = await getServerSessionWithTest()
  if (!session) redirect('/login')

  const isAdmin = session?.user?.isAdmin || false
  const Layout = isAdmin ? AdminLayoutChakra : ClientLayout

  // URL du dashboard staff/admin FOSSBilling (ex: https://billing.monsite.tld/staff)
  const src = process.env.NEXT_PUBLIC_FOSSBILLING_DASHBOARD_URL || ''

  return (
    <Layout>
      <ExternalIframe title="FOSSBilling" src={src} />
    </Layout>
  )
}



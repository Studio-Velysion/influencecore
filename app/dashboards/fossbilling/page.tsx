import { getServerSessionWithTest } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ClientLayout from '@/components/client/layout/ClientLayout'
import AdminLayoutChakra from '@/components/admin/layout/AdminLayoutChakra'
import ExternalIframe from '@/components/integrations/ExternalIframe'

export default async function FossbillingDashboardPage() {
  const session = await getServerSessionWithTest()
  if (!session) redirect('/login')

  const isAdmin = session?.user?.isAdmin || false
  const Layout = isAdmin ? AdminLayoutChakra : ClientLayout

  const target = process.env.NEXT_PUBLIC_FOSSBILLING_DASHBOARD_URL || ''
  const nextPath = (() => {
    if (!target) return '/billing'
    try {
      const u = new URL(target)
      return `${u.pathname}${u.search}`
    } catch {
      return target.startsWith('/') ? target : '/billing'
    }
  })()
  const src = `/api/fossbilling/session?next=${encodeURIComponent(nextPath)}`

  return (
    <Layout>
      <ExternalIframe title="FOSSBilling" src={src} />
    </Layout>
  )
}



import { getServerSessionWithTest } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ClientLayout from '@/components/client/layout/ClientLayout'
import AdminLayoutChakra from '@/components/admin/layout/AdminLayoutChakra'
import ServiceDashboardClient from '@/components/dashboards/ServiceDashboardClient'

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
      <ServiceDashboardClient
        title="FOSSBilling"
        description="Facturation & abonnements. Vue abonnements côté InfluenceCore + accès au back-office FOSSBilling."
        src={src}
        actions={[
          { label: 'Mes abonnements', href: '/subscriptions', variant: 'solid', colorScheme: 'orange' },
          { label: 'Ouvrir en plein écran', href: '/integrations/fossbilling', variant: 'outline', colorScheme: 'orange' },
        ]}
      />
    </Layout>
  )
}



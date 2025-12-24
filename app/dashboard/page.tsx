import { getServerSessionWithTest } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ClientLayout from '@/components/client/layout/ClientLayout'
import DashboardContent from '@/components/client/dashboard/DashboardContent'

export default async function DashboardPage() {
  const session = await getServerSessionWithTest()
  if (!session) redirect('/login')

  return (
    <ClientLayout>
      <DashboardContent />
    </ClientLayout>
  )
}


import { getServerSessionWithTest } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { checkPermission, PERMISSIONS } from '@/lib/permissions'
import AdminLayoutChakra from '@/components/admin/layout/AdminLayoutChakra'

export const metadata = {
  title: 'Admin - InfluenceCore',
  description: 'Panneau d\'administration InfluenceCore',
}

export default async function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSessionWithTest()

  if (!session) {
    redirect('/login')
  }

  const hasAccess = await checkPermission(PERMISSIONS.ADMIN_ACCESS)

  if (!hasAccess) {
    redirect('/dashboard')
  }

  return <AdminLayoutChakra>{children}</AdminLayoutChakra>
}

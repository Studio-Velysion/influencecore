import { getServerSessionWithTest } from '@/lib/auth'
import { redirect } from 'next/navigation'
import KanbanBoard from '@/components/ideas/KanbanBoard'
import ClientLayout from '@/components/client/layout/ClientLayout'

export default async function IdeasPage() {
  const session = await getServerSessionWithTest()

  if (!session) redirect('/login')

  return (
    <ClientLayout>
      <KanbanBoard />
    </ClientLayout>
  )
}


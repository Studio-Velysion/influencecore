import { getServerSessionWithTest } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ScriptsList from '@/components/scripts/ScriptsList'
import ClientLayout from '@/components/client/layout/ClientLayout'

export default async function ScriptsPage() {
  const session = await getServerSessionWithTest()

  if (!session) redirect('/login')

  return (
    <ClientLayout>
      <ScriptsList />
    </ClientLayout>
  )
}


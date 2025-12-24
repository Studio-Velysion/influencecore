import { getServerSessionWithTest } from '@/lib/auth'
import { redirect } from 'next/navigation'
import CalendarView from '@/components/calendar/CalendarView'
import ClientLayout from '@/components/client/layout/ClientLayout'

export default async function CalendarPage() {
  const session = await getServerSessionWithTest()

  if (!session) redirect('/login')

  return (
    <ClientLayout>
      <CalendarView />
    </ClientLayout>
  )
}


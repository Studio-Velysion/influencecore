import { getServerSessionWithTest } from '@/lib/auth'
import { redirect } from 'next/navigation'
import NotesList from '@/components/notes/NotesList'
import ClientLayout from '@/components/client/layout/ClientLayout'

export default async function NotesPage() {
  const session = await getServerSessionWithTest()

  if (!session) redirect('/login')

  return (
    <ClientLayout>
      <NotesList />
    </ClientLayout>
  )
}


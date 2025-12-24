import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import IdeaDetail from '@/components/ideas/IdeaDetail'
import Navbar from '@/components/common/Navbar'

export default async function IdeaDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) redirect('/login')

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <IdeaDetail ideaId={params.id} />
      </main>
    </div>
  )
}


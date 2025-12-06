import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Home() {
  const session = await getServerSession(authOptions)

  // Si connecté, rediriger vers le dashboard
  if (session) {
    redirect('/dashboard')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="z-10 max-w-5xl w-full items-center justify-between text-center">
        <h1 className="text-5xl font-bold mb-4 text-gray-900">
          InfluenceCore
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Plateforme de gestion pour créateurs de contenu
        </p>
        <p className="text-gray-500 mb-12 max-w-2xl mx-auto">
          Organisez vos idées, scripts et workflow vidéo en un seul endroit.
          Conçu pour YouTubeurs, Streamers, Vidéastes et Influenceurs.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Se connecter
          </Link>
          <Link
            href="/register"
            className="bg-white text-primary-600 px-6 py-3 rounded-lg border-2 border-primary-600 hover:bg-primary-50 transition-colors font-medium"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </main>
  )
}


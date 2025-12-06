import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import Navbar from '@/components/common/Navbar'
import QuickNotesWidget from '@/components/dashboard/QuickNotesWidget'
import StatsWidget from '@/components/dashboard/StatsWidget'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Bienvenue sur votre Dashboard
          </h2>
          <p className="mt-2 text-gray-600">
            Gérez vos idées, scripts et workflow vidéo en un seul endroit
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Carte Nouvelle idée vidéo */}
          <Link
            href="/ideas"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow block"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nouvelle idée vidéo
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Enregistrez une nouvelle idée de contenu
            </p>
            <div className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors text-center">
              Créer une idée
            </div>
          </Link>

          {/* Carte Notes rapides */}
          <Link
            href="/notes"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow block"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Notes rapides
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Capturez vos pensées instantanément
            </p>
            <div className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors text-center">
              Voir toutes les notes
            </div>
          </Link>

          {/* Carte Stats */}
          <Link
            href="/dashboard"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow block"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Statistiques
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Vue d'ensemble de votre activité
            </p>
            <div className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Voir les détails →
            </div>
          </Link>
        </div>

        {/* Widget Statistiques */}
        <div className="mt-8">
          <StatsWidget />
        </div>

        {/* Widget Notes instantanées */}
        <div className="mt-8">
          <QuickNotesWidget />
        </div>
      </main>
    </div>
  )
}


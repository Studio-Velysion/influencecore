import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import Navbar from '@/components/common/Navbar'
import { prisma } from '@/lib/prisma'

export default async function SubscribeSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Vérifier que l'utilisateur a bien un abonnement actif
  const userSubscription = await prisma.userSubscription.findFirst({
    where: {
      userId: session.user.id,
      status: {
        in: ['active', 'trialing'],
      },
    },
    include: {
      plan: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Paiement réussi !
            </h1>
            <p className="text-gray-600">
              Votre abonnement a été activé avec succès.
            </p>
          </div>

          {userSubscription && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Détails de votre abonnement
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-medium text-gray-900">
                    {userSubscription.plan.name}
                  </span>
                </div>
                {userSubscription.currentPeriodEnd && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prochain renouvellement:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(userSubscription.currentPeriodEnd).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <a
              href="/dashboard"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Aller au Dashboard
            </a>
            <a
              href="/subscribe"
              className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Voir les plans
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}


import { Suspense } from 'react'
import LoginForm from '@/components/auth/LoginForm'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

async function LoginContent() {
  const session = await getServerSession(authOptions)

  // Si déjà connecté, rediriger vers le dashboard
  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold text-gray-900">
            InfluenceCore
          </h1>
          <h2 className="mt-6 text-center text-2xl font-semibold text-gray-900">
            Connexion
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Connectez-vous à votre espace créateur
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Chargement...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}


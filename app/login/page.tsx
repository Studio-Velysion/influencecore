import { Suspense } from 'react'
import LoginForm from '@/components/auth/LoginForm'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { redirect } from 'next/navigation'

async function LoginContent() {
  const session = await getServerSession(authOptions)

  // Si déjà connecté, rediriger vers le dashboard
  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Effet de fond avec dégradé violet subtil */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-bg-primary to-pink-900/10 pointer-events-none" />
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div>
          <h1 className="text-center text-4xl font-bold bg-gradient-purple-pink bg-clip-text text-transparent">
            InfluenceCore
          </h1>
          <h2 className="mt-6 text-center text-2xl font-semibold text-text-primary">
            Connexion
          </h2>
          <p className="mt-2 text-center text-sm text-text-tertiary">
            Connectez-vous à votre espace créateur
          </p>
        </div>
        <div className="card-velysion">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="text-text-tertiary">Chargement...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}


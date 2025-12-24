'use client'

import { useState, useEffect } from 'react'
import { getProviders, signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasKeycloak, setHasKeycloak] = useState(false)

  useEffect(() => {
    if (searchParams?.get('registered') === 'true') {
      setSuccess('Compte créé avec succès ! Vous pouvez maintenant vous connecter.')
    }
  }, [searchParams])

  useEffect(() => {
    let mounted = true
    getProviders()
      .then((providers) => {
        if (!mounted) return
        setHasKeycloak(!!providers?.keycloak)
      })
      .catch(() => {
        // ignore
      })
    return () => {
      mounted = false
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Email ou mot de passe incorrect')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="bg-state-success/20 border border-state-success/30 text-state-success px-4 py-3 rounded-lg">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-state-error/20 border border-state-error/30 text-state-error px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {hasKeycloak && (
        <button
          type="button"
          className="btn-velysion-primary w-full"
          onClick={() => signIn('keycloak', { callbackUrl: '/dashboard' })}
        >
          Se connecter avec Keycloak
        </button>
      )}

      {hasKeycloak && (
        <div className="text-center text-xs text-text-tertiary">
          ou
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input-velysion w-full"
          placeholder="votre@email.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input-velysion w-full"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-velysion-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>

      <p className="text-center text-sm text-text-tertiary">
        Pas encore de compte ?{' '}
        <Link href="/register" className="link-velysion font-medium">
          Créer un compte
        </Link>
      </p>
    </form>
  )
}


'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    pseudo: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name || null,
          pseudo: formData.pseudo || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Une erreur est survenue')
        return
      }

      // Rediriger vers la page de connexion avec un message de succès
      router.push('/login?registered=true')
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-state-error/20 border border-state-error/30 text-state-error px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
          Email *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="input-velysion w-full"
          placeholder="votre@email.com"
        />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-2">
          Nom (optionnel)
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className="input-velysion w-full"
          placeholder="Votre nom"
        />
      </div>

      <div>
        <label htmlFor="pseudo" className="block text-sm font-medium text-text-secondary mb-2">
          Pseudo (optionnel)
        </label>
        <input
          id="pseudo"
          name="pseudo"
          type="text"
          value={formData.pseudo}
          onChange={handleChange}
          className="input-velysion w-full"
          placeholder="Votre pseudo"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">
          Mot de passe *
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
          className="input-velysion w-full"
          placeholder="••••••••"
        />
        <p className="mt-1 text-xs text-text-muted">Minimum 6 caractères</p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary mb-2">
          Confirmer le mot de passe *
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          minLength={6}
          className="input-velysion w-full"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-velysion-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Création...' : 'Créer mon compte'}
      </button>

      <p className="text-center text-sm text-text-tertiary">
        Déjà un compte ?{' '}
        <Link href="/login" className="link-velysion font-medium">
          Se connecter
        </Link>
      </p>
    </form>
  )
}


'use client'

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-text-secondary hover:text-purple-400 px-4 py-2 rounded-lg hover:bg-bg-hover transition-velysion border border-border-dark hover:border-purple-500/30"
    >
      Déconnexion
    </button>
  )
}


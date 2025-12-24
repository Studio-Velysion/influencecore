'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoutButton from '@/components/auth/LogoutButton'
import { useSession } from 'next-auth/react'

export default function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  // En mode dev (BYPASS_AUTH), NextAuth retourne déjà une session de test
  // Donc on peut toujours afficher la navbar
  if (!session) {
    return null
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/ideas', label: 'Idées' },
    { href: '/scripts', label: 'Scripts' },
    { href: '/calendar', label: 'Calendrier' },
    { href: '/notes', label: 'Notes' },
  ]

  // Vérifier si l'utilisateur est admin
  const isAdmin = session?.user?.isAdmin || false

  return (
    <nav className="bg-bg-secondary/80 backdrop-blur-md border-b border-border-dark sticky top-0 z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-xl font-bold bg-gradient-purple-pink bg-clip-text text-transparent">
              InfluenceCore
            </Link>
            <nav className="hidden md:flex space-x-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-velysion ${
                    isActive
                      ? 'text-purple-400 bg-purple-500/20 border border-purple-500/30'
                      : 'text-text-secondary hover:text-purple-400 hover:bg-bg-hover'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            {isAdmin && (
              <>
                <Link
                  href="/admin"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-velysion ${
                    pathname === '/admin' || pathname?.startsWith('/admin/')
                      ? 'text-purple-400 bg-purple-500/20 border border-purple-500/30'
                      : 'text-text-secondary hover:text-purple-400 hover:bg-bg-hover'
                  }`}
                >
                  Administration
                </Link>
              </>
            )}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-text-secondary">
              {session.user?.name || session.user?.pseudo || session.user?.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </div>
    </nav>
  )
}


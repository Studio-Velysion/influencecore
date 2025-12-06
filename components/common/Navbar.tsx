'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoutButton from '@/components/auth/LogoutButton'
import { useSession } from 'next-auth/react'

export default function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()

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
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-xl font-bold text-gray-900">
              InfluenceCore
            </Link>
            <nav className="hidden md:flex space-x-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === '/admin' || pathname?.startsWith('/admin/')
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Administration
                </Link>
                <Link
                  href="/admin/subscriptions"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === '/admin/subscriptions'
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Abonnements
                </Link>
              </>
            )}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              {session.user?.name || session.user?.pseudo || session.user?.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </div>
    </nav>
  )
}


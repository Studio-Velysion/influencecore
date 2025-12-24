'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function AdminHeader() {
  const { data: session } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <nav className="app-header navbar navbar-expand bg-body">
      <div className="container-fluid">
        {/* Start Navbar Links */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link"
              data-lte-toggle="sidebar"
              href="#"
              role="button"
              onClick={(e) => {
                e.preventDefault()
                setSidebarOpen(!sidebarOpen)
              }}
            >
              <i className="bi bi-list"></i>
            </a>
          </li>
          <li className="nav-item d-none d-md-block">
            <Link href="/" className="nav-link">
              Accueil
            </Link>
          </li>
        </ul>
        {/* End Start Navbar Links */}

        {/* End Navbar Links */}
        <ul className="navbar-nav ms-auto">
          {/* Fullscreen Toggle */}
          <li className="nav-item">
            <a
              className="nav-link"
              href="#"
              data-lte-toggle="fullscreen"
              onClick={(e) => {
                e.preventDefault()
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen()
                } else {
                  document.exitFullscreen()
                }
              }}
            >
              <i className="bi bi-arrows-fullscreen"></i>
            </a>
          </li>

          {/* User Menu Dropdown */}
          <li className="nav-item dropdown user-menu">
            <a
              href="#"
              className="nav-link dropdown-toggle"
              data-bs-toggle="dropdown"
            >
              <span className="d-none d-md-inline">
                {session?.user?.name || 'Admin'}
              </span>
            </a>
            <ul className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
              <li className="user-header text-bg-primary">
                <p>
                  {session?.user?.name || 'Administrateur'}
                  <small>{session?.user?.email}</small>
                </p>
              </li>
              <li className="user-footer">
                <Link href="/dashboard" className="btn btn-default btn-flat">
                  Dashboard
                </Link>
                <Link
                  href="/api/auth/signout"
                  className="btn btn-default btn-flat float-end"
                >
                  Déconnexion
                </Link>
              </li>
            </ul>
          </li>
        </ul>
        {/* End End Navbar Links */}
      </div>
    </nav>
  )
}


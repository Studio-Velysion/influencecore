'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  label: string
  href: string
  icon: string
  children?: NavItem[]
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: 'bi-speedometer',
  },
  {
    label: 'Utilisateurs',
    href: '/admin/users',
    icon: 'bi-people',
  },
  {
    label: 'Keycloak (Rôles)',
    href: '/integrations/keycloak',
    icon: 'bi-shield-lock',
  },
  {
    label: 'CMS',
    href: '#',
    icon: 'bi-pencil-square',
    children: [
      {
        label: 'Page d\'accueil',
        href: '/admin/cms',
        icon: 'bi-circle',
      },
    ],
  },
  {
    label: 'Paramètres',
    href: '/admin/settings',
    icon: 'bi-gear',
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname?.startsWith(href)
  }

  return (
    <aside className="app-sidebar bg-body-secondary shadow" data-bs-theme="dark">
      {/* Sidebar Brand */}
      <div className="sidebar-brand">
        <Link href="/admin" className="brand-link">
          <span className="brand-text fw-light">InfluenceCore Admin</span>
        </Link>
      </div>

      {/* Sidebar Wrapper */}
      <div className="sidebar-wrapper">
        <nav className="mt-2">
          <ul
            className="nav sidebar-menu flex-column"
            data-lte-toggle="treeview"
            role="navigation"
            aria-label="Main navigation"
            data-accordion="false"
          >
            {navItems.map((item) => (
              <li
                key={item.href}
                className={`nav-item ${isActive(item.href) ? 'menu-open' : ''}`}
              >
                {item.children ? (
                  <>
                    <a
                      href="#"
                      className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
                    >
                      <i className={`nav-icon ${item.icon}`}></i>
                      <p>
                        {item.label}
                        <i className="nav-arrow bi bi-chevron-right"></i>
                      </p>
                    </a>
                    <ul className="nav nav-treeview">
                      {item.children.map((child) => (
                        <li key={child.href} className="nav-item">
                          <Link
                            href={child.href}
                            className={`nav-link ${isActive(child.href) ? 'active' : ''}`}
                          >
                            <i className={`nav-icon ${child.icon}`}></i>
                            <p>{child.label}</p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
                  >
                    <i className={`nav-icon ${item.icon}`}></i>
                    <p>{item.label}</p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  )
}


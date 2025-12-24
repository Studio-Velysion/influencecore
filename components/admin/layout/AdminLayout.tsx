'use client'

import { ReactNode } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import AdminFooter from './AdminFooter'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="app-wrapper">
      {/* Header */}
      <AdminHeader />

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="app-main">
        {/* Content Header */}
        <div className="app-content-header">
          <div className="container-fluid">
            {/* Breadcrumb will be added per page */}
          </div>
        </div>

        {/* Content */}
        <div className="app-content">
          <div className="container-fluid">{children}</div>
        </div>
      </main>

      {/* Footer */}
      <AdminFooter />
    </div>
  )
}


'use client'

import { useEffect } from 'react'
import Script from 'next/script'

export default function AdminStyles() {
  useEffect(() => {
    // Add AdminLTE body classes
    if (typeof document !== 'undefined') {
      document.body.className = 'layout-fixed sidebar-expand-lg sidebar-open bg-body-tertiary'
    }
    
    // Initialize OverlayScrollbars for sidebar after scripts load
    const initScrollbars = () => {
      if (typeof window !== 'undefined' && (window as any).OverlayScrollbars) {
        const sidebarWrapper = document.querySelector('.sidebar-wrapper')
        if (sidebarWrapper) {
          ;(window as any).OverlayScrollbars(sidebarWrapper, {
            scrollbars: {
              theme: 'os-theme-light',
              autoHide: 'leave',
              clickScroll: true,
            },
          })
        }
      }
    }

    // Try to initialize after a short delay to ensure scripts are loaded
    setTimeout(initScrollbars, 100)
  }, [])

  return (
    <>
      {/* AdminLTE JS */}
      <Script
        src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/overlayscrollbars@2.11.0/browser/overlayscrollbars.browser.es6.min.js"
        strategy="lazyOnload"
        onLoad={() => {
          // Initialize OverlayScrollbars after load
          if (typeof window !== 'undefined' && (window as any).OverlayScrollbars) {
            const sidebarWrapper = document.querySelector('.sidebar-wrapper')
            if (sidebarWrapper) {
              ;(window as any).OverlayScrollbars(sidebarWrapper, {
                scrollbars: {
                  theme: 'os-theme-light',
                  autoHide: 'leave',
                  clickScroll: true,
                },
              })
            }
          }
        }}
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/admin-lte@4.0.0-rc4/dist/js/adminlte.min.js"
        strategy="lazyOnload"
      />
    </>
  )
}


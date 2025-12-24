'use client'

import Link from 'next/link'
import { CSSProperties } from 'react'

interface HomeButtonProps {
  href: string
  children: React.ReactNode
  style: CSSProperties
  hoverStyle?: {
    backgroundColor?: string
    boxShadow?: string
    opacity?: string
  }
}

export default function HomeButton({ href, children, style, hoverStyle }: HomeButtonProps) {
  return (
    <Link
      href={href}
      style={style}
      onMouseEnter={(e) => {
        // Appliquer les styles hover
        if (hoverStyle?.backgroundColor) {
          e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor
        }
        if (hoverStyle?.boxShadow) {
          e.currentTarget.style.boxShadow = hoverStyle.boxShadow
        }
        if (hoverStyle?.opacity) {
          e.currentTarget.style.opacity = hoverStyle.opacity
        }
      }}
      onMouseLeave={(e) => {
        // Restaurer les styles initiaux depuis le prop style
        if (hoverStyle?.backgroundColor) {
          e.currentTarget.style.backgroundColor = (style.backgroundColor as string) || ''
        }
        if (hoverStyle?.boxShadow) {
          e.currentTarget.style.boxShadow = 'none'
        }
        if (hoverStyle?.opacity) {
          e.currentTarget.style.opacity = (style.opacity as string) || '1'
        }
      }}
    >
      {children}
    </Link>
  )
}


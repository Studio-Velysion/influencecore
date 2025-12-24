'use client'

import { HTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

interface VelysionCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hover?: boolean
  glow?: boolean
  className?: string
}

export default function VelysionCard({
  children,
  hover = true,
  glow = false,
  className,
  ...props
}: VelysionCardProps) {
  return (
    <div
      className={clsx(
        'card-velysion',
        hover && 'hover:border-border-hover hover:shadow-velysion-md',
        glow && 'glow-purple',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}


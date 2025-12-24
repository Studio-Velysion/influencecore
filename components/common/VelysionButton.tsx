'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

interface VelysionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gradient' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  className?: string
}

export default function VelysionButton({
  variant = 'primary',
  size = 'md',
  children,
  className,
  disabled,
  ...props
}: VelysionButtonProps) {
  const baseClasses = 'font-semibold rounded-lg transition-velysion focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary'
  
  const variantClasses = {
    primary: 'bg-gold-500 text-text-inverse hover:bg-gold-600 hover:glow-gold focus:ring-gold-500',
    secondary: 'bg-transparent border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white hover:glow-purple focus:ring-purple-500',
    gradient: 'gradient-purple-pink text-white hover:opacity-90 hover:shadow-velysion-lg focus:ring-purple-500',
    outline: 'bg-transparent border border-border-dark text-text-secondary hover:border-purple-500 hover:text-purple-400 focus:ring-purple-500',
  }
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }
  
  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed hover:bg-gold-500 hover:glow-gold'
    : ''

  return (
    <button
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabledClasses,
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}


import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DropdownItemProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  danger?: boolean
}

export default function DropdownItem({
  children,
  onClick,
  className,
  danger = false,
}: DropdownItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left px-4 py-2 text-sm transition-colors',
        danger
          ? 'text-red-600 hover:bg-red-50'
          : 'text-gray-700 hover:bg-gray-50',
        className
      )}
    >
      {children}
    </button>
  )
}


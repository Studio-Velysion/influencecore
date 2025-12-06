'use client'

import { useState, ReactNode, useRef } from 'react'
import { useClickOutside } from '@/hooks/useClickOutside'
import { cn } from '@/lib/utils'

interface DropdownProps {
  trigger: ReactNode
  children: ReactNode
  align?: 'left' | 'right'
  className?: string
}

export default function Dropdown({
  trigger,
  children,
  align = 'right',
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useClickOutside(dropdownRef, () => setIsOpen(false))

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-2 w-56 rounded-lg bg-white shadow-lg border border-gray-200 py-1',
            align === 'left' ? 'left-0' : 'right-0',
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}


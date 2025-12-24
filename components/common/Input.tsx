import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-secondary mb-2">
            {label}
            {props.required && <span className="text-state-error ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'input-velysion w-full',
            error && 'border-state-error focus:ring-state-error',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-state-error">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-text-muted">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input


import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', variant = 'default', ...props }, ref) => {
    const baseClasses =
      'w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none focus:ring-4 font-medium transition-all duration-200';

    const variantClasses = {
      default:
        'border-slate-200 focus:ring-red-500/20 focus:border-red-500 text-slate-700',
      error:
        'border-red-300 focus:ring-red-500/20 focus:border-red-600 text-slate-700',
    };

    return (
      <input
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

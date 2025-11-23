import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  variant?: 'default' | 'error';
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', variant = 'default', children, ...props }, ref) => {
    const baseClasses =
      'w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none focus:ring-4 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
      default:
        'border-slate-200 focus:ring-red-500/20 focus:border-red-500 text-slate-700',
      error:
        'border-red-300 focus:ring-red-500/20 focus:border-red-600 text-slate-700',
    };

    return (
      <select
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = 'Select';

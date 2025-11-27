import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error';
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', variant = 'default', label, error, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    const baseClasses =
      'w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none focus:ring-4 font-medium transition-all duration-200';

    const variantClasses = {
      default:
        'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700',
      error:
        'border-red-300 focus:ring-red-500/20 focus:border-red-600 text-slate-700',
    };

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-semibold text-slate-700 mb-2"
          >
            {label}
            {props.required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`${baseClasses} ${variantClasses[variant]} ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

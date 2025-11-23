import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'error';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', variant = 'default', ...props }, ref) => {
    const baseClasses =
      'w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none focus:ring-4 font-medium transition-all duration-200 resize-none';

    const variantClasses = {
      default:
        'border-slate-200 focus:ring-red-500/20 focus:border-red-500 text-slate-700',
      error:
        'border-red-300 focus:ring-red-500/20 focus:border-red-600 text-slate-700',
    };

    return (
      <textarea
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

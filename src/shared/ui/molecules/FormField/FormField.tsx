import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export interface FormFieldProps {
  label: string;
  icon?: LucideIcon;
  required?: boolean;
  children: ReactNode;
}

export const FormField = ({ label, icon: Icon, required, children }: FormFieldProps) => {
  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
        {Icon && <Icon className="w-5 h-5 text-red-600" />}
        {label}
        {required && <span className="text-red-600">*</span>}
      </label>
      {children}
    </div>
  );
};

import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export interface InfoBoxProps {
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: 'info' | 'warning' | 'error' | 'success';
  children?: ReactNode;
}

export const InfoBox = ({
  icon: Icon,
  title,
  description,
  variant = 'info',
  children,
}: InfoBoxProps) => {
  const variantConfig = {
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-900',
      descColor: 'text-blue-800',
    },
    warning: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      titleColor: 'text-red-900',
      descColor: 'text-red-800',
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-300',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      titleColor: 'text-red-900',
      descColor: 'text-red-800',
    },
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      titleColor: 'text-green-900',
      descColor: 'text-green-800',
    },
  };

  const { bgColor, borderColor, iconBg, iconColor, titleColor, descColor } =
    variantConfig[variant];

  return (
    <div className={`${bgColor} border-2 ${borderColor} rounded-2xl p-5 shadow-md`}>
      <div className="flex items-start gap-3">
        <div className={`${iconBg} p-3 rounded-xl shadow-sm flex-shrink-0`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div className="flex-1">
          <h4 className={`text-base font-bold ${titleColor} mb-1`}>{title}</h4>
          <p className={`text-sm ${descColor}`}>{description}</p>
          {children}
        </div>
      </div>
    </div>
  );
};

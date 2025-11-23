import { CheckCircle2, AlertTriangle } from 'lucide-react';
import type { ReactNode } from 'react';

export interface ConfirmationModalProps {
  isOpen: boolean;
  type: 'success' | 'error';
  message: string;
  title?: string;
  children?: ReactNode;
}

export const ConfirmationModal = ({
  isOpen,
  type,
  message,
  title,
  children,
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  const config = {
    success: {
      icon: CheckCircle2,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      titleColor: 'text-green-900',
      messageColor: 'text-green-700',
      defaultTitle: '¡Éxito!',
    },
    error: {
      icon: AlertTriangle,
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
      titleColor: 'text-red-900',
      messageColor: 'text-red-700',
      defaultTitle: 'Error',
    },
  };

  const { icon: Icon, bgColor, iconColor, titleColor, messageColor, defaultTitle } = config[type];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-300">
        <div className="flex flex-col items-center text-center">
          <div className={`p-4 rounded-2xl mb-4 ${bgColor}`}>
            <Icon className={`w-12 h-12 ${iconColor}`} />
          </div>

          <h3 className={`text-2xl font-bold mb-2 ${titleColor}`}>
            {title || defaultTitle}
          </h3>
          <p className={`text-base ${messageColor}`}>{message}</p>

          {children && <div className="mt-4 w-full">{children}</div>}
        </div>
      </div>
    </div>
  );
};

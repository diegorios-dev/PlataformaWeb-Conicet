import type { ReactNode } from 'react';
import IconNavMenu from '@features/menu/components/IconNavMenu';
import BackButton from '@shared/ui/buttons/BackButton';

export interface DashboardLayoutProps {
  children: ReactNode;
  showBackButton?: boolean;
  className?: string;
  contentClassName?: string;
}

export const DashboardLayout = ({
  children,
  showBackButton = false,
  className = '',
  contentClassName = ''
}: DashboardLayoutProps) => {
  return (
    <div 
      className={`min-h-screen pt-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 ${className}`}
    >
      <IconNavMenu />
      {showBackButton && <BackButton />}
      <main className={`container mx-auto px-4  ${contentClassName}`}>
        {children}
      </main>
    </div>
  );
};

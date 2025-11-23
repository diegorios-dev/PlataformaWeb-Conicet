import type { ReactNode } from 'react';
import BackButton from '@shared/ui/buttons/BackButton';
import NavMenu from '../NavMenu';
import IconNavMenu from '@features/menu/components/IconNavMenu';
import { useAuth } from '@context/AuthContext';

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
  const { user } = useAuth();
  const isAdmin = user?.rol === 'admin';

  return (
    <div 
      className={`h-screen pt-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 ${className}`}
    >
      {isAdmin ? <IconNavMenu /> : <NavMenu />}
      {showBackButton && <BackButton />}
      <main className={`container mx-auto px-4  ${contentClassName}`}>
        {children}
      </main>
    </div>
  );
};

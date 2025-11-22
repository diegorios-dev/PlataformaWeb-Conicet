import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import useUser from '@hooks/useUser';

interface AuthContextType {
  user: any;
  password: string;
  error: string | null;
  loading: boolean;
  isLogin: boolean;
  fetchGetUserByPassword: (e: React.FormEvent) => Promise<void>;
  handleSavePassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogout: () => void;
  getUsername: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { 
    user, 
    fetchGetUserByPassword, 
    isLogin, 
    password, 
    error, 
    loading, 
    handleSavePassword, 
    handleLogout, 
    getUsername 
  } = useUser();

  const value = useMemo(
    () => ({
      user,
      password,
      error,
      loading,
      isLogin,
      fetchGetUserByPassword,
      handleSavePassword,
      handleLogout,
      getUsername,
    }),
    [user, password, error, loading, isLogin, fetchGetUserByPassword, handleSavePassword, handleLogout, getUsername]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

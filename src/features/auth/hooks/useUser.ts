import { useState, useEffect } from 'react';
import { login } from '@features/user/services';
import { storageService, tokenService } from '@shared/services';

type User = {
  rol: string;
  name?: string;
};

function useUser() {
  
  const [user, setUser] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Load user and verify token on mount
  useEffect(() => {
    const storedUser = storageService.getUser();
    const hasToken = tokenService.hasToken();
    
    
    if (storedUser && hasToken) {
      try {
        setUser(storedUser);
        validateLogin(storedUser);
      } catch (error) {
        storageService.removeUser();
        tokenService.removeToken();
      }
    } else {
      // If user exists but no token, or vice versa, clear both
      if (storedUser || hasToken) {
        storageService.removeUser();
        tokenService.removeToken();
      }
    }
    
    setIsCheckingAuth(false);
  }, []);

  const validateLogin = (userData: User | null) => {
    setIsLogin(userData?.rol === "admin");
  };

  const handleSavePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    // Limpiar error al empezar a escribir
    if (error) setError(null);
  };

  const fetchGetUserByPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const data = await login(password);
      const fetchedUser = data?.user ?? null;
      setUser(fetchedUser);
      validateLogin(fetchedUser);
      
      if (fetchedUser) {
        storageService.setUser(fetchedUser);
      }
    } catch (err: any) {
      
      // Determinar el mensaje de error apropiado
      let errorMessage = "Error al iniciar sesión";
      
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 404) {
          errorMessage = "Contraseña incorrecta";
        } else if (err.response.status === 500) {
          errorMessage = "Error en el servidor. Intenta más tarde";
        } else if (err.response.status === 403) {
          errorMessage = "Acceso denegado";
        } else {
          errorMessage = `Error: ${err.response.status}`;
        }
      } else if (err.request) {
        errorMessage = "No se pudo conectar con el servidor";
      } else {
        errorMessage = err.message || "Error desconocido";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsLogin(false);
    setPassword("");
    setError(null);
   
    storageService.removeUser();
    tokenService.removeToken();
  };

  const getUsername = () => {
    return user?.name || "Usuario";
  };

  return {
    user,
    isLogin,
    password,
    error,
    loading,
    isCheckingAuth,
    handleSavePassword,
    fetchGetUserByPassword,
    handleLogout,
    getUsername,
  };
}

export default useUser;
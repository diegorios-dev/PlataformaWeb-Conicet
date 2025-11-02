import { useState, useEffect } from 'react';
import { login } from '../services/userService';

type User = {
  rol: string;
  nombre?: string;
  username?: string;
};

function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        validateLogin(userData);
      } catch (error) {
        console.error("Error al cargar usuario desde localStorage:", error);
        localStorage.removeItem('user');
      }
    }
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
      console.log(data);
      const fetchedUser = data?.user ?? null;
      setUser(fetchedUser);
      validateLogin(fetchedUser);
      
      if (fetchedUser) {
        localStorage.setItem('user', JSON.stringify(fetchedUser));
      }
    } catch (err: any) {
      console.error("Error al validar usuario:", err);
      
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
   
    localStorage.removeItem('user');
  };

  const getUsername = () => {
    return user?.nombre || user?.username || "Usuario";
  };

  return {
    user,
    isLogin,
    password,
    error,
    loading,
    handleSavePassword,
    fetchGetUserByPassword,
    handleLogout,
    getUsername,
  };
}

export default useUser;
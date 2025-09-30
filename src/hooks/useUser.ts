import { useState } from 'react';
import { getUserByPassword } from '../services/userService';

function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [password, setPassword] = useState("");

  const validateLogin = (userData: User | null) => {
    setIsLogin(userData?.rol === "admin");
  };

  const handleSavePassword = (e) => {
    setPassword(e.target.value)
  }

  const fetchGetUserByPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await getUserByPassword(password);
      const fetchedUser = data?.user ?? null;
      setUser(fetchedUser);
      validateLogin(fetchedUser);
    } catch (error) {
      alert("Contraseña inválida");
      console.error("Error al validar usuario:", error);
    }
  };

  return {
    user,
    isLogin,
    password,
    handleSavePassword,
    fetchGetUserByPassword,
  };
}

export default useUser;

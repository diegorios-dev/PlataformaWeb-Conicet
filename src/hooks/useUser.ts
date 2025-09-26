import { useState } from 'react';
import { getUser } from "../services/userService";

type User = {
  rol: string;
  // agrega otros campos según tu modelo
};

function useUser(password: string) {
  const [showLogin, setShowLogin] = useState(false); // Mostrar login al inicio
  const [user, setUser] = useState<User | null>(null);

  const showLoginForm = () => setShowLogin(true);
  const hideLoginForm = () => setShowLogin(false);

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await getUser(password);
      setUser(data.user);
      hideLoginForm();
      console.log("Usuario validado:", data.user);
    } catch (error) {
      alert("Contraseña inválida");
      console.error("Error al validar usuario:", error);
    }
  };

  return {
    handlePassword,
    user,
    showLogin,
    showLoginForm,
    hideLoginForm,
  };
}

export default useUser;
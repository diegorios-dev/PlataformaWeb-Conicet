import { useState } from 'react';
import { getUser } from "../services/userService";

type User = {
  rol: string;
};

function useUser(password: string) {
  
  const [user, setUser] = useState<User | null>(null);

  const handleUserApi = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await getUser(password);
      setUser(data.user);
      console.log("Usuario validado:", data.user);
    } catch (error) {
      alert("Contraseña inválida");
      console.error("Error al validar usuario:", error);
    }

  };

  return {
    handleUserApi,
    user
  };
}

export default useUser;
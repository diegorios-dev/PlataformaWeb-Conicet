import { createContext, useContext, useState, ReactNode } from "react";
import useUser from "../hooks/useUser";

type UserContextType = {
  user: any;
  password: string;
  handleUserApi: (e: React.FormEvent) => Promise<void>;
  handleSavePassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);




export const UserProvider = ({ children }: { children: ReactNode }) => {
  
  const [password, setPassword] = useState("");
  
  const {user , handleUserApi } = useUser(password);

  const handleSavePassword = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  return (
    <UserContext.Provider
      value={{
        user,
        password,
        handleSavePassword , 
        handleUserApi
      }}
    >
      {children}
    </UserContext.Provider>
  );
};


// Hook auxiliar para consumir el contexto fácilmente
export const useUserContext = () => {

  const ctx = useContext(UserContext);

  if (!ctx) {
    throw new Error("useUserContext debe usarse dentro de <UserProvider>");
  }
  return ctx;
};

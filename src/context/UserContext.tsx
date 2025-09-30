import { createContext, useContext, useState, ReactNode } from "react";
import useUser from "../hooks/useUser";

type UserContextType = {
  user: any;
  password: string;
  fetchGetUserByPassword: (e: React.FormEvent) => Promise<void>;
  handleSavePassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectReport : any ; 
  report : any ; 
  isLogin : any 

};

const UserContext = createContext<UserContextType | undefined>(undefined);


export const UserProvider = ({ children }: { children: ReactNode }) => {

  const [report, setReport] = useState<any | null>(null);

  const handleSelectReport = (report : any) => {
    setReport(report)
  }
  
  const {user , fetchGetUserByPassword , isLogin , password , handleSavePassword } = useUser();


  return (
    <UserContext.Provider
      value={{
        user,
        password,
        fetchGetUserByPassword,
        handleSavePassword ,
        handleSelectReport,
        report,
        isLogin
      }}
    >
      {children}
    </UserContext.Provider>
  );
};


export const useUserContext = () => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUserContext debe usarse dentro de <UserProvider>");
  }
  return ctx;
};

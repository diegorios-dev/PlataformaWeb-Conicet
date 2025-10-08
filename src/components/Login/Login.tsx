import { useEffect } from "react";
import { useUserContext } from "../../context/UserContext";
import useNavegation from "../../hooks/useNavegation";
import { Lock, LogIn, ArrowLeft } from "lucide-react";

const Login = () => {
  const { password, handleSavePassword, fetchGetUserByPassword, isLogin } = useUserContext();
  const { goHome } = useNavegation();

  useEffect(() => {
    if (isLogin) goHome();
  }, [isLogin]);

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <form
        className="p-8 rounded-2xl space-y-6 w-96 bg-white shadow-md flex flex-col"
        onSubmit={fetchGetUserByPassword}
      >
        <h2 className="text-2xl font-semibold text-center mb-2 tracking-tight">Iniciar sesión</h2>
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
         
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={handleSavePassword}
            className="bg-transparent outline-none flex-1 text-gray-900 placeholder-gray-400"
          />
           <Lock className="w-5 h-5 text-gray-500" />
        </div>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-2 rounded-full font-medium hover:bg-blue-700 transition"
        >
          <LogIn className="w-5 h-5" />
          Entrar
        </button>
        <button
          type="button"
          onClick={goHome}
          className="flex items-center justify-center gap-2 w-full bg-gray-200 text-gray-700 py-2 rounded-full font-medium hover:bg-gray-300 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>
      </form>
    </div>
  );
};

export default Login;
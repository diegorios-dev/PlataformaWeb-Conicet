import { useEffect } from "react";
import { useUserContext } from "../../context/UserContext";
import useNavegation from "../../hooks/useNavegation";

const Login = () => {
  const { password, handleSavePassword, fetchGetUserByPassword, isLogin } = useUserContext();
  const { goHome } = useNavegation();

  useEffect(() => {
    if (isLogin) goHome();
  }, [isLogin]);

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-900">
      <form className="bg-gray-800 p-6 rounded-lg space-y-4 w-80 text-white" onSubmit={fetchGetUserByPassword}>
        <h2 className="text-xl font-bold text-center">Iniciar sesión</h2>
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={handleSavePassword}
          className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="w-full bg-green-600 p-2 rounded-lg hover:bg-green-700">
          Entrar
        </button>
        <button type="button" onClick={goHome} className="w-full bg-gray-600 p-2 rounded-lg hover:bg-gray-700">
          Volver
        </button>
      </form>
    </div>
  );
};

export default Login
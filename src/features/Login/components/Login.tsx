import { useEffect } from "react";
import { useUserContext } from "@context/UserContext";
import useNavegation from "@hooks/useNavegation";
import { Lock, LogIn, ArrowLeft, AlertCircle } from "lucide-react";

// Ruta absoluta para assets en /public/
const img = "/assets/logo-CONICET_opt.png";

const Login = () => {
  const { password, handleSavePassword, fetchGetUserByPassword, isLogin, error, loading } = useUserContext();

  const { go } = useNavegation();

  useEffect(() => {
    if (isLogin) {
      sessionStorage.setItem('newLogin', 'true');
      go.home();
    }
  }, [isLogin, go.home]);

  return (
    
    <div className="flex h-screen">
      {/* LADO IZQUIERDO - Fondo azul y logo */}
      <div className="w-1/2 bg-blue-600 flex items-center justify-center">
        <div className="flex flex-col items-center text-white">
          <img
            src={img}
            alt="CONICET"
            className="w-40 mb-6 drop-shadow-lg"
          />
        </div>
      </div>

      {/* LADO DERECHO - Formulario de login */}
      <div className="w-1/2 flex items-center justify-center bg-gray-50">
        <form
          onSubmit={fetchGetUserByPassword}
          className="bg-white p-10 rounded-2xl shadow-lg w-96 flex flex-col space-y-6"
        >
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-2">
            Login
          </h2>

          {/* Mensaje de error profesional */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-900 mb-1">Error de autenticación</p>
                <p className="text-xs text-red-700">{error}</p>
              </div>
            </div>
          )}

          <div className={`flex items-center gap-3 bg-gray-100 rounded-full px-5 py-3 border transition-all ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-200'
          }`}>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={handleSavePassword}
              disabled={loading}
              className="bg-transparent outline-none flex-1 text-gray-900 placeholder-gray-400 disabled:cursor-not-allowed"
            />
            <Lock className={`w-5 h-5 ${error ? 'text-red-500' : 'text-gray-500'}`} />
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 rounded-full font-medium text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Validando...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Entrar
              </>
            )}
          </button>

          <button
            type="button"
            onClick={go.home}
            className="flex items-center justify-center gap-2 w-full bg-gray-200 text-gray-700 py-3 rounded-full font-medium text-lg hover:bg-gray-300 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
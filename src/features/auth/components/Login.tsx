import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavegation } from "@shared/hooks";
import { storageService } from '@shared/services';
import { Lock, LogIn, LogOut, ArrowLeft, AlertCircle } from "lucide-react";

// Ruta absoluta para assets en /public/
const img = "/assets/logo-CONICET_opt.png";

const Login = () => {
  const { password, handleSavePassword, fetchGetUserByPassword, isLogin, error, loading } = useAuth();

  const { go } = useNavegation();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showLogoutNotif, setShowLogoutNotif] = useState(false);
  const [logoutUsername, setLogoutUsername] = useState("");

  // Animación de entrada
  useEffect(() => {
    const timer = setTimeout(() => setIsEntering(false), 100);
    return () => clearTimeout(timer);
  }, []);

  // Verificar si viene de un logout
  useEffect(() => {
    const shouldShowLogoutNotif = storageService.getShowLogoutNotif();
    if (shouldShowLogoutNotif) {
      const username = sessionStorage.getItem('logoutUsername') || 'Usuario';
      setLogoutUsername(username);
      setShowLogoutNotif(true);
      
      // Limpiar flags
      storageService.removeShowLogoutNotif();
      sessionStorage.removeItem('logoutUsername');
      
      // Ocultar notificación después de 3 segundos
      setTimeout(() => {
        setShowLogoutNotif(false);
      }, 3000);
    }
  }, []);

  // Manejo de login exitoso con animación
  useEffect(() => {
    if (isLogin) {
      setLoginSuccess(true);
      setTimeout(() => {
        storageService.setNewLogin();
        go.home();
      }, 800); // Tiempo para mostrar animación de éxito
    }
  }, [isLogin, go]);

  const handleVolver = () => {
    setIsAnimating(true);
    // Espera a que termine la animación antes de navegar
    setTimeout(() => {
      go.home();
    }, 500); // 500ms = duración de la animación
  };

  return (
    
    <div className="flex h-screen overflow-hidden relative">
      {/* Notificación de logout */}
      {showLogoutNotif && (
        <div className="fixed top-6 left-2/3 transform -translate-x-1/2 z-50 animate-slide-down">
          <div className="backdrop-blur-xl bg-red-500/95 border border-red-400/50 px-8 py-5 rounded-2xl shadow-2xl shadow-red-500/20 flex items-center gap-4 min-w-[600px]">
            <div className="relative">
              <div className="relative p-3 rounded-xl bg-white shadow-lg">
                <LogOut className="w-6 h-6 text-red-500" strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-white/90 mb-0.5 tracking-wide uppercase">
                Sesión cerrada
              </p>
              <p className="text-lg font-bold text-white">
                Hasta pronto, {logoutUsername}
              </p>
            </div>
            <div className="h-12 w-1 bg-white/30 rounded-full"></div>
          </div>
        </div>
      )}

      {/* Overlay de éxito */}
      {loginSuccess && (
        <div className="absolute inset-0 bg-blue-500 z-50 flex items-center justify-center animate-fade-in">
          <div className="text-white text-center animate-scale-in">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white flex items-center justify-center animate-bounce-in">
              <LogIn className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-3xl font-bold">Bienvenido Administrador</h2>
          </div>
        </div>
      )}

      {/* LADO IZQUIERDO - Fondo azul y logo */}
      <div 
        className={`w-1/2 bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center transition-all duration-500 ease-in-out ${
          isAnimating ? '-translate-x-full' : 'translate-x-0'
        } ${isEntering ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}
      >
        <div className="flex flex-col items-center text-white animate-float">
          <img
            src={img}
            alt="CONICET"
            className="w-40 mb-6 drop-shadow-2xl animate-fade-in-slow"
          />
          <div className="h-1 w-32 bg-white/30 rounded-full animate-width-expand"></div>
        </div>
      </div>

      {/* LADO DERECHO - Formulario de login */}
      <div className={`w-1/2 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 transition-all duration-500 ${
        isEntering ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      }`}>
        <form
          onSubmit={fetchGetUserByPassword}
          className="bg-white p-10 rounded-2xl shadow-2xl w-96 flex flex-col space-y-6 animate-slide-up-fade"
        >
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-2">
            Acceso Administrativo
          </h2>

          <p className="text-center text-gray-600 text-xs">Esta sección está destinada únicamente al personal autorizado del CONICET.</p>

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
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-full font-medium text-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl"
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
            onClick={handleVolver}
            disabled={isAnimating}
            className="flex items-center justify-center gap-2 w-full bg-gray-200 text-gray-700 py-3 rounded-full font-medium text-lg hover:bg-gray-300 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
        </form>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes fadeInSlow {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes widthExpand {
          from {
            width: 0;
          }
          to {
            width: 8rem;
          }
        }

        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes bounceIn {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-fade-in-slow {
          animation: fadeInSlow 1s ease-out forwards;
        }

        .animate-width-expand {
          animation: widthExpand 1s ease-out 0.5s forwards;
        }

        .animate-slide-up-fade {
          animation: slideUpFade 0.6s ease-out 0.3s forwards;
          opacity: 0;
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-scale-in {
          animation: scaleIn 0.5s ease-out forwards;
        }

        .animate-bounce-in {
          animation: bounceIn 0.6s ease-out forwards;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-5px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(5px);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        .animate-slide-down {
          animation: slide-down 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Login;
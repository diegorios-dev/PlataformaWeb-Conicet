import { useMemo, useState, useEffect } from "react";
import useSitio from "../hooks/useSitio";
import MapHTML from "./MapHTML";
import { useUserContext } from "../context/UserContext";
import useNavegation from "../hooks/useNavegation";
import ViewOptionMenu from "./Menu/ViewOptionMenu";
import ViewComplementMenu from "./Menu/ViewComplementMenu";
import { OPTION_INSTRUMENTS } from "../constants/optionInstruments";
import { LogIn, LogOut, Wrench, CheckCircle, AlertCircle } from "lucide-react";
import img from "../assets/logo-CONICET_opt.png";

const Home = () => {
  const { goAHistograma, goEstadisticas } = useNavegation();

  const [selectOptionMenu, setSelectOptionMenu] = useState("Lluvia");

  const { sitios, loading, error } = useSitio(selectOptionMenu);
  
  const { isLogin, handleLogout, getUsername } = useUserContext();
  const { goLogin, goAdminUi, goHeatMap } = useNavegation();
  const [showWelcome, setShowWelcome] = useState(false);

  // Mostrar mensaje de bienvenida SOLO cuando el usuario acaba de iniciar sesión
  useEffect(() => {
    // Verificar si es un login nuevo (marcado desde el componente Login)
    const isNewLogin = sessionStorage.getItem('newLogin');
    
    if (isLogin && isNewLogin === 'true') {
      setShowWelcome(true);
      
      // Limpiar la marca de nuevo login
      sessionStorage.removeItem('newLogin');
      
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isLogin]);

  const handleLogoutClick = () => {
    handleLogout();
    goLogin();
  };

  const OPTION_COMPLEMENTS = [
    { option: "Ver Histograma", onClick: goAHistograma },
    { option: "Ver Mapa de Calor", onClick: goHeatMap },
    { option: "Ver Estadísticas", onClick: goEstadisticas },
  ];

  // 🧠 Memorizar los puntos para no cambiar referencia en cada render
  const pointsMap = useMemo(() => sitios, [sitios]);

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Mensaje de bienvenida */}
      {showWelcome && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
            <CheckCircle className="w-6 h-6" />
            <span className="font-semibold text-lg">
              Has ingresado con el usuario: {getUsername()}
            </span>
          </div>
        </div>
      )}

      <aside className="w-96 bg-white border-r border-gray-200 flex flex-col justify-between text-[17px]">
        <div className="p-10">
          <div className="flex justify-center">
            <img src={img} alt="Logo Conicet" className="max-w-[180px] mb-6" />
          </div>

          <div className="mb-12">
            <h3 className="text-base font-bold text-gray-500 mb-5 tracking-wider uppercase">
              Análisis
            </h3>

            {isLogin && (
              <button
                onClick={goAdminUi}
                className="group relative flex items-center gap-3 w-full px-6 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 mb-4 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <Wrench className="w-6 h-6 relative z-10" />
                <span className="relative z-10">Panel Admin</span>
              </button>
            )}

            <ViewOptionMenu
              instruments={OPTION_INSTRUMENTS}
              selectedInstrument={selectOptionMenu}
              onSelectInstrument={setSelectOptionMenu}
            />
          </div>

          <div>
            <h3 className="text-base font-semibold text-gray-500 mb-5 tracking-wider uppercase">
              Visualización
            </h3>
            <ViewComplementMenu complements={OPTION_COMPLEMENTS} />
          </div>
        </div>

        <div className="p-10 border-t border-gray-200">
          {isLogin ? (
            <button
              onClick={handleLogoutClick}
              className="group relative w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-br from-yellow-500 to-amber-600 text-white shadow-lg shadow-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              <LogOut className="w-6 h-6 relative z-10" />
              <span className="relative z-10">Cerrar Sesión</span>
            </button>
          ) : (
            <button
              onClick={goLogin}
              className="group relative w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              <LogIn className="w-6 h-6 relative z-10" />
              <span className="relative z-10">Login</span>
            </button>
          )}
        </div>
      </aside>

      <main className="flex-1 bg-gray-50 flex items-center justify-center">
        {error ? (
          <div className="max-w-md w-full mx-auto p-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="w-8 h-8 text-red-600" />
                <h3 className="text-lg font-bold text-red-900">Error al cargar datos</h3>
              </div>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Recargar página
              </button>
            </div>
          </div>
        ) : (
          <MapHTML position={pointsMap} loading={loading} />
        )}
      </main>

    </div>
  );
};

export default Home;
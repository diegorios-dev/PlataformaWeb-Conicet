import { useMemo, useState, useEffect, useCallback } from "react";
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
  const { goAHistograma} = useNavegation();

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

  // ⚡ Memorizar función de logout para evitar re-renders
  const handleLogoutClick = useCallback(() => {
    handleLogout();
    goLogin();
  }, [handleLogout, goLogin]);

  useEffect(() => {
    console.log("Instrumento seleccionado:", selectOptionMenu);
    console.log("Sitios cargados:", sitios);
  }, [selectOptionMenu, sitios]);

  // ⚡ Memorizar opciones de menú complement
  const OPTION_COMPLEMENTS = useMemo(() => [
    { option: "Ver Histograma", onClick: goAHistograma },
    { option: "Ver Mapa de Calor", onClick: goHeatMap },
  ], [goAHistograma, goHeatMap]);

  // 🧠 Memorizar los puntos para no cambiar referencia en cada render
  const pointsMap = useMemo(() => sitios, [sitios]);

  // Estilos coherentes (paleta azul CONICET + gris claro, radio consistente y variantes)
  const btnBase =
    "group relative w-full flex items-center gap-3 px-5 py-3 rounded-xl text-[15px] font-semibold transition-all duration-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300";
  const btnPrimary =
    `${btnBase} bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-700/30 hover:scale-[1.01] active:scale-[0.99]`;
  const btnWarn =
    `${btnBase} bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-600/20 hover:shadow-amber-600/30 hover:scale-[1.01] active:scale-[0.99]`;
  const btnGhost =
    `${btnBase} bg-white/70 text-slate-700 border border-slate-200 hover:bg-white/90`;

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 relative">
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

      {/* Sidebar con glassmorphism */}
      <aside className="w-96 bg-white/60 backdrop-blur-md border-r border-white/60 shadow-xl supports-[backdrop-filter]:bg-white/50 flex flex-col justify-between text-[16px]">
        <div className="p-8">
          <div className="flex justify-center">
            <img src={img} alt="Logo Conicet" className="max-w-[170px] mb-6 drop-shadow-sm" />
          </div>

          <div className="mb-12">
            <h3 className="text-sm font-bold text-slate-600 mb-4 tracking-wider uppercase">
              Análisis
            </h3>

            {isLogin && (
              <button
                onClick={goAdminUi}
                className={`${btnPrimary} mb-4 justify-start`}
              >
                <Wrench className="w-5 h-5" />
                <span>Panel Admin</span>
              </button>
            )}

            <ViewOptionMenu
              instruments={OPTION_INSTRUMENTS}
              selectedInstrument={selectOptionMenu}
              onSelectInstrument={setSelectOptionMenu}
            />
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-600 mb-4 tracking-wider uppercase">
              Visualización
            </h3>
            <ViewComplementMenu complements={OPTION_COMPLEMENTS} />
          </div>
        </div>

        <div className="p-8 border-t border-white/60">
          {isLogin ? (
            <button
              onClick={handleLogoutClick}
              className={`${btnWarn} justify-center`}
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar Sesión</span>
            </button>
          ) : (
            <button
              onClick={goLogin}
              className={`${btnPrimary} justify-center`}
            >
              <LogIn className="w-5 h-5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </aside>

      <main className="flex-1 bg-transparent flex items-center justify-center">
        {error ? (
          <div className="max-w-md w-full mx-auto p-8">
            <div className="bg-red-50/90 border border-red-200 rounded-xl p-6 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="w-8 h-8 text-red-600" />
                <h3 className="text-lg font-bold text-red-900">Error al cargar datos</h3>
              </div>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300"
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